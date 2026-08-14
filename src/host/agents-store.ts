import * as vscode from 'vscode';
import { copilotSessionStateDir, sessionsDir } from '../config/paths';
import { loadAgentSessions } from '../model/sessions/load';
import { AgentSession } from '../model/types';

// Live agents are read on their own channel rather than as a field on the snapshot, for the reason
// settings are: the two answer questions the other's disk read can't. An agent starting shouldn't
// re-read 38 SKILL.md files, and saving a skill shouldn't re-read every transcript.
//
// It matters more here than it did there. A session file is written at startup and never touched
// again, so this watcher only fires when an agent starts or exits — the thing that will eventually
// keep the list current is a poll, and a poll on the snapshot would re-walk the whole config every
// couple of seconds, forever, while the panel is open.

// A process appearing and its socket appearing are two events for one change.
const REFRESH_DEBOUNCE_MS: number = 150;

let agents: AgentSession[] | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<AgentSession[]> = new vscode.EventEmitter();

export const onDidChangeAgents: vscode.Event<AgentSession[]> = changeEmitter.event;

export const currentAgents = async (): Promise<AgentSession[]> => agents ?? refreshAgents();

// Last read, no disk access. What `panel.ts` checks a transcript path against.
export const cachedAgents = (): AgentSession[] => agents ?? [];

export const refreshAgents = async (): Promise<AgentSession[]> => {
  const next: AgentSession[] = await loadAgentSessions();
  agents = next;
  changeEmitter.fire(next);
  return next;
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
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

const scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void refreshAgents(), REFRESH_DEBOUNCE_MS);
};
