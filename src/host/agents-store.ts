import * as vscode from 'vscode';
import { sessionsDir } from '../config/paths';
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
let watcher: vscode.FileSystemWatcher | undefined;
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

// One watcher, on the directory that holds one file per running process.
export const startWatchingAgents = (): void => {
  const pattern: vscode.RelativePattern = new vscode.RelativePattern(
    vscode.Uri.file(sessionsDir()),
    '*.json'
  );
  watcher = vscode.workspace.createFileSystemWatcher(pattern);
  watcher.onDidCreate(scheduleRefresh);
  watcher.onDidDelete(scheduleRefresh);
  watcher.onDidChange(scheduleRefresh);
};

export const stopWatchingAgents = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  watcher?.dispose();
  watcher = undefined;
};

const scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void refreshAgents(), REFRESH_DEBOUNCE_MS);
};
