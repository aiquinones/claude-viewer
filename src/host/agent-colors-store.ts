import * as vscode from 'vscode';
import { parseAgentColors } from '../model/agent-colors';
import { AgentColor, AgentColors } from '../model/types';

// Where a row's chosen colour lives. Not `settings.json`: those keys are settings a person edits and
// reads back, and this is a map of session ids that die with their processes. `globalState` is
// global rather than workspace-scoped because the surface lists agents working anywhere on this
// machine, and a row in the Elsewhere group is exactly the one worth colouring.
//
// Nothing here touches `~/.claude`. The read-only promise is about Claude's config; this is the
// extension remembering a choice you made in its own panel.
const STATE_KEY: string = 'claudeViewer.agentColors';

let store: vscode.Memento | undefined;

const changeEmitter: vscode.EventEmitter<AgentColors> = new vscode.EventEmitter();

// Fires whenever the map changes. The panel posts it on, the same as settings and agents.
export const onDidChangeAgentColors: vscode.Event<AgentColors> = changeEmitter.event;

// Called at activate. The store is a Memento rather than the whole context, so nothing in here can
// reach for anything else on it.
export const initAgentColors = (memento: vscode.Memento): void => {
  store = memento;
};

export const currentAgentColors = (): AgentColors => parseAgentColors(store?.get(STATE_KEY));

interface SetAgentColorArgs {
  sessionId: string;
  // Absent clears the row.
  color?: AgentColor;
}

export const setAgentColor = async ({ sessionId, color }: SetAgentColorArgs): Promise<void> => {
  const colors: AgentColors = currentAgentColors();
  if (color) colors[sessionId] = color;
  else delete colors[sessionId];

  await _write(colors);
};

// Drops the sessions that aren't running any more. Called with every agent list the panel posts, so
// the map stays bounded by what's alive rather than growing one entry per session forever.
export const pruneAgentColors = async (liveSessionIds: string[]): Promise<void> => {
  const colors: AgentColors = currentAgentColors();
  const live: Set<string> = new Set(liveSessionIds);

  const stale: string[] = Object.keys(colors).filter((sessionId) => !live.has(sessionId));
  if (stale.length === 0) return;

  for (const sessionId of stale) delete colors[sessionId];
  await _write(colors);
};

const _write = async (colors: AgentColors): Promise<void> => {
  await store?.update(STATE_KEY, colors);
  changeEmitter.fire(colors);
};
