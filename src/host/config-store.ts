import * as vscode from 'vscode';
import {
  CLAUDE_FILE,
  LOCAL_CLAUDE_FILE,
  memoryDir,
  skillRoots,
  userClaudeDir
} from '../config/paths';
import { perfPhase } from '../model/perf/recorder';
import { emptySnapshot, SnapshotParts, startSnapshotParts } from '../model/snapshot';
import { ConfigSnapshot, SkillRoot, SnapshotPart } from '../model/types';
import { workspaceRoot } from './workspace';

// A single save fires several watcher events; this is how long they're coalesced for.
const REFRESH_DEBOUNCE_MS: number = 150;

let snapshot: ConfigSnapshot | undefined;
// The load in flight, so several askers arriving at once share one pass over the disk rather than
// each starting their own.
let loading: Promise<ConfigSnapshot> | undefined;
// Which load a part belongs to. A watcher can fire while the last one is still walking the
// workspace, and without this the two would merge into one object.
let generation: number = 0;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<ConfigSnapshot> = new vscode.EventEmitter();

// Fires on every part that lands, not only on a finished read: the panel posts each one on, and
// `pending` says what is still coming.
export const onDidChangeSnapshot: vscode.Event<ConfigSnapshot> = changeEmitter.event;

// Everything read so far, and which parts haven't landed. Never awaits and never reads the disk —
// the panel draws from this and fills itself in as the parts arrive.
export const snapshotSoFar = (): ConfigSnapshot => snapshot ?? emptySnapshot(workspaceRoot());

// The whole config, waited for. What the palette, the tree and the deep links take: a skill picker
// holding half the skills is worse than one that takes a moment.
export const currentSnapshot = async (): Promise<ConfigSnapshot> => {
  if (snapshot && snapshot.pending.length === 0) return snapshot;

  await (loading ?? refreshSnapshot());
  // A watcher can fire while that one was walking, and the load being awaited then answers for a
  // generation that has already been superseded — so its parts were dropped and what's in hand is
  // half a read. Ask again rather than hand it back.
  return currentSnapshot();
};

// Last build, no disk read. Undefined until something asks, and may be missing parts.
export const cachedSnapshot = (): ConfigSnapshot | undefined => snapshot;

export const refreshSnapshot = async (): Promise<ConfigSnapshot> => {
  const mine: number = ++generation;
  const root: string | undefined = workspaceRoot();

  // The shell first: every merge below builds on it, so it has to be in place before any of them
  // can run. It's also what gives the panel a folder to draw and three surfaces that say they're
  // still reading.
  publish(emptySnapshot(root));

  loading = load({ root, mine });
  return loading;
};

interface LoadArgs {
  root: string | undefined;
  mine: number;
}

// The parent stage, so the perf card still folds the three loaders under one row. They're started
// inside it rather than beside it, which is what keeps their reads attributed to both.
const load = async ({ root, mine }: LoadArgs): Promise<ConfigSnapshot> => {
  await perfPhase('snapshot', async () => {
    const parts: SnapshotParts = startSnapshotParts(root);

    await Promise.all([
      parts.skills.then((skills) => merge({ mine, part: 'skills', values: { skills } })),
      parts.systemPrompt.then((systemPrompt) =>
        merge({ mine, part: 'systemPrompt', values: { systemPrompt } })
      ),
      parts.memory.then((memory) => merge({ mine, part: 'memory', values: { memory } }))
    ]);
  });

  if (mine === generation) loading = undefined;
  return snapshotSoFar();
};

interface MergeArgs {
  mine: number;
  part: SnapshotPart;
  // The one field this part fills in, already under its own name.
  values: Partial<ConfigSnapshot>;
}

// One loader's answer onto the snapshot, and off the pending list. A part from a superseded load is
// dropped rather than merged — it describes config that has already been read again.
const merge = ({ mine, part, values }: MergeArgs): void => {
  if (mine !== generation || !snapshot) return;

  // `loadedAt` deliberately doesn't move: it names *this read*, which is what makes it usable as a
  // cache key — `useFileBody` re-fetches on it and the skill graph is keyed on it, and both would
  // fire once per part if each merge stamped a new time.
  publish({
    ...snapshot,
    ...values,
    pending: snapshot.pending.filter((waiting) => waiting !== part)
  });
};

const publish = (next: ConfigSnapshot): void => {
  snapshot = next;
  changeEmitter.fire(next);
};

// One watcher per skill root, plus the CLAUDE.md files — config changes mid-session.
export const startWatching = async (): Promise<void> => {
  const roots: SkillRoot[] = await skillRoots(workspaceRoot());
  for (const root of roots) watch({ dir: root.dir, glob: '**/*' });

  // An imported file that isn't a CLAUDE.md — an AGENTS.md, a house-style file — isn't covered
  // here, so editing one needs the refresh button. Watching every .md in the workspace is worse.
  watch({ dir: userClaudeDir(), glob: CLAUDE_FILE });

  const folder: string | undefined = workspaceRoot();
  if (!folder) return;

  watch({ dir: folder, glob: `**/{${CLAUDE_FILE},${LOCAL_CLAUDE_FILE}}` });
  // Claude writes memories mid-session, and a memory appearing while the panel is open is the
  // surface's best demo. The directory doesn't have to exist yet — the watcher fires when it does.
  watch({ dir: memoryDir(folder), glob: '*.md' });
};

interface WatchArgs {
  dir: string;
  glob: string;
}

const watch = ({ dir, glob }: WatchArgs): void => {
  const pattern: vscode.RelativePattern = new vscode.RelativePattern(vscode.Uri.file(dir), glob);
  const watcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(pattern);
  watcher.onDidChange(scheduleRefresh);
  watcher.onDidCreate(scheduleRefresh);
  watcher.onDidDelete(scheduleRefresh);
  watchers.push(watcher);
};

export const stopWatching = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

const scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void refreshSnapshot(), REFRESH_DEBOUNCE_MS);
};
