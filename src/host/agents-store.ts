import * as vscode from 'vscode';
import { copilotSessionStateDir, sessionsDir } from '../config/paths';
import { perfPhase } from '../model/perf/recorder';
import { carryForward } from '../model/sessions/carry-forward';
import { CopilotPrCache, newCopilotPrCache } from '../model/sessions/copilot/pull-request';
import { loadAgentSessions } from '../model/sessions/load';
import { SkillTrailCache, newSkillTrailCache } from '../model/sessions/skill-trail';
import { AgentSession } from '../model/types';

// Live agents are read on their own channel rather than as a field on the snapshot, for the reason
// settings are: the two answer questions the other's disk read can't. An agent starting shouldn't
// re-read 38 SKILL.md files, and saving a skill shouldn't re-read every transcript.
//
// It matters more here than it did there. A session file is written at startup and never touched
// again, so the watchers only fire when an agent starts or exits — everything that happens *during*
// a session comes from the poll below, and a poll on the snapshot would re-walk the whole config
// every couple of seconds for as long as the panel stayed open.

// A process appearing and its socket appearing are two events for one change.
const REFRESH_DEBOUNCE_MS: number = 150;

// How often the transcripts are re-read, by what the panel is showing. The watchers below only
// fire when an agent starts or exits, so without this a running agent's row is a photograph: the
// view's one-second clock re-ages it but can never learn that the agent did something.
//
// Deliberately not annotated — a type here would widen the keys AgentPollMode derives from.
export const AGENT_POLL_MS = {
  // The Active Agents surface is up. Every row is a claim about what an agent is doing right now.
  live: 2_000,
  // Some other surface. The only thing reading agents is the landing card's count, which changes
  // when a process starts or exits — already watched, so this is just the crash case.
  background: 30_000,
  // Nothing on screen shows agents. Not a rate: the entry exists so `off` is a mode like any other.
  off: 0
} as const;

export type AgentPollMode = keyof typeof AGENT_POLL_MS;

let agents: AgentSession[] | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;
let pollMode: AgentPollMode = 'off';
let pollTimer: NodeJS.Timeout | undefined;

// Held across passes so a Copilot log is walked whole once and by its appended bytes after. It's
// here rather than inside the loader for the reason `usage-store.ts` holds its own: nothing in
// `model/` keeps state, so a cache belongs to whoever decided to poll.
const copilotPullRequests: CopilotPrCache = newCopilotPrCache();

// Held across passes for the same reason: a session's skill loads are spread through its whole log,
// so the first pass walks the file and every pass after reads only what was appended.
const skillTrails: SkillTrailCache = newSkillTrailCache();

const changeEmitter: vscode.EventEmitter<AgentSession[]> = new vscode.EventEmitter();

export const onDidChangeAgents: vscode.Event<AgentSession[]> = changeEmitter.event;

export const currentAgents = async (): Promise<AgentSession[]> => agents ?? refreshAgents();

// Last read, no disk access. What `panel.ts` checks a transcript path against.
export const cachedAgents = (): AgentSession[] => agents ?? [];

export const refreshAgents = async (): Promise<AgentSession[]> => {
  const loaded: AgentSession[] = await perfPhase('agents', () =>
    loadAgentSessions({ copilotPullRequests, skillTrails })
  );
  // The third thing held across passes, and the only one that isn't a cache of work: a row's PR
  // link, context reading and last prompt live further back in the log than the window each pass
  // reads, so they'd blink out whenever something large was written. Carried before the comparison
  // below, or a field dropping and coming back would count as two changes and redraw the surface
  // twice for nothing.
  const next: AgentSession[] = carryForward(agents ?? [], loaded);
  const changed: boolean = signature(next) !== signature(agents);
  agents = next;
  // Most poll passes find exactly what the last one did, and firing anyway would re-render the
  // whole surface every couple of seconds for nothing.
  if (changed) changeEmitter.fire(next);
  return next;
};

// The whole array rather than the fields that happen to render today: a new field on AgentSession
// would otherwise quietly stop reaching the view. Sessions are a handful of small objects.
const signature = (sessions: AgentSession[] | undefined): string | undefined =>
  JSON.stringify(sessions);

// What the panel is showing, which is the only thing that says how fresh these rows have to be.
// Set by panel.ts — nothing else knows whether the surface is on screen.
export const setAgentPollMode = (mode: AgentPollMode): void => {
  if (mode === pollMode) return;
  pollMode = mode;
  schedulePoll();
};

// Chained off the end of each pass rather than an interval. One pass re-reads a tail per live
// session — 64KB each for Claude, 256KB for Copilot — and a slow disk must not be able to stack
// passes up behind each other.
const schedulePoll = (): void => {
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;

  const interval: number = AGENT_POLL_MS[pollMode];
  if (interval === 0) return;

  pollTimer = setTimeout(() => void poll(), interval);
};

// Re-arms from the current mode, so a mode set mid-read takes effect on the next pass rather than
// racing this one.
const poll = async (): Promise<void> => {
  await refreshAgents();
  schedulePoll();
};

// One watcher per CLI, each on the file that marks a process as alive: Claude writes one JSON file
// per pid in a flat directory, Copilot writes a lock into the session's own directory. Both fire on
// exactly the event this store cares about — an agent starting or exiting.
//
// Neither log file is watched. They change on every tool call, and a refresh here re-reads every
// session; wiring those together is a redraw storm.
export const startWatchingAgents = (): void => {
  watchers = [
    watch(sessionsDir(), '*.json'),
    watch(copilotSessionStateDir(), '**/inuse.*.lock')
  ];
};

const watch = (dir: string, glob: string): vscode.FileSystemWatcher => {
  const pattern: vscode.RelativePattern = new vscode.RelativePattern(vscode.Uri.file(dir), glob);
  const watcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(pattern);
  watcher.onDidCreate(scheduleRefresh);
  watcher.onDidDelete(scheduleRefresh);
  watcher.onDidChange(scheduleRefresh);
  return watcher;
};

export const stopWatchingAgents = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  setAgentPollMode('off');
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

const scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void refreshAgents(), REFRESH_DEBOUNCE_MS);
};
