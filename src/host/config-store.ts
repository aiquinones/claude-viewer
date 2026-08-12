import * as vscode from 'vscode';
import {
  CLAUDE_FILE,
  LOCAL_CLAUDE_FILE,
  sessionsDir,
  skillRoots,
  userClaudeDir
} from '../config/paths';
import { buildSnapshot } from '../model/snapshot';
import { ConfigSnapshot, SkillRoot } from '../model/types';
import { workspaceRoot } from './workspace';

// A single save fires several watcher events; this is how long they're coalesced for.
const REFRESH_DEBOUNCE_MS: number = 150;

let snapshot: ConfigSnapshot | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<ConfigSnapshot> = new vscode.EventEmitter();

// Fires on every rebuild: the panel posts it on, the tree redraws.
export const onDidChangeSnapshot: vscode.Event<ConfigSnapshot> = changeEmitter.event;

// The snapshot every reader shares — panel, tree, palette.
export const currentSnapshot = async (): Promise<ConfigSnapshot> => snapshot ?? refreshSnapshot();

// Last build, no disk read. Undefined until something asks.
export const cachedSnapshot = (): ConfigSnapshot | undefined => snapshot;

export const refreshSnapshot = async (): Promise<ConfigSnapshot> => {
  const next: ConfigSnapshot = await buildSnapshot(workspaceRoot());
  snapshot = next;
  changeEmitter.fire(next);
  return next;
};

// One watcher per skill root, plus the CLAUDE.md files — config changes mid-session.
export const startWatching = async (): Promise<void> => {
  const roots: SkillRoot[] = await skillRoots(workspaceRoot());
  for (const root of roots) watch({ dir: root.dir, glob: '**/*' });

  // An imported file that isn't a CLAUDE.md — an AGENTS.md, a house-style file — isn't covered
  // here, so editing one needs the refresh button. Watching every .md in the workspace is worse.
  watch({ dir: userClaudeDir(), glob: CLAUDE_FILE });

  const folder: string | undefined = workspaceRoot();
  if (folder) watch({ dir: folder, glob: `**/{${CLAUDE_FILE},${LOCAL_CLAUDE_FILE}}` });

  // An agent starting or exiting is one of these files appearing or disappearing. What each agent
  // is *doing* lives in its transcript, which isn't watched: those change on every tool call, and
  // a rebuild walks the workspace. The view ages its own rows instead.
  watch({ dir: sessionsDir(), glob: '*.json' });
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
