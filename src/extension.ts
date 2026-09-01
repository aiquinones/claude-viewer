import * as vscode from 'vscode';
import { ANALYZE_SESSION_COMMAND, analyzeSession } from './commands/analyze-session/analyze-session';
import { FIND_SKILL_COMMAND, findSkill } from './commands/find-skill/find-skill';
import { handleUri } from './commands/handle-uri/handle-uri';
import {
  SETUP_DELIVERABLES_COMMAND,
  setupDeliverables
} from './commands/setup-deliverables/setup-deliverables';
import {
  OPEN_SURFACE_COMMANDS,
  openSurface
} from './commands/open-surface/open-surface';
import { perfMark } from './model/perf/recorder';
import { initAgentColors } from './host/agent-colors-store';
import { startWatchingAgents, stopWatchingAgents } from './host/agents-store';
import { writeDeliverableDoc } from './host/deliverable-doc';
import { startWatching, stopWatching } from './host/config-store';
import { LAUNCH_COMMAND, openPanel } from './host/panel';
import { startWatchingSettings } from './host/settings-store';
import { stopWatchingSessionDetail } from './host/session-detail-store';
import { registerTree } from './host/tree/register-tree';
import { stopWatchingUsage } from './host/usage-store';

// Wiring only. Every entry point's body lives under commands/ or host/, so what a user can invoke
// is readable from this one screen.
export const activate = (context: vscode.ExtensionContext): void => {
  const started: number = performance.now();

  // The row colours live in this extension's own storage, so the store needs it before any panel
  // opens.
  initAgentColors(context.globalState);

  context.subscriptions.push(
    vscode.commands.registerCommand(LAUNCH_COMMAND, () => openPanel({ context })),
    vscode.commands.registerCommand(FIND_SKILL_COMMAND, () => void findSkill({ context })),
    vscode.commands.registerCommand(ANALYZE_SESSION_COMMAND, () => void analyzeSession({ context })),
    vscode.commands.registerCommand(
      SETUP_DELIVERABLES_COMMAND,
      () => void setupDeliverables({ context })
    ),
    // One body, one registration per surface it opens. Adding a surface to the palette is an entry
    // in that map plus one in package.json.
    ...Object.entries(OPEN_SURFACE_COMMANDS).map(([command, surface]) =>
      vscode.commands.registerCommand(command, () => openSurface({ context, surface }))
    ),
    vscode.window.registerUriHandler({ handleUri: (uri) => void handleUri({ context, uri }) }),
    startWatchingSettings(),
    ...registerTree({ context })
  );

  // The tree is visible with nothing opened, so watching starts here, not with the panel.
  void startWatching();
  // One file per running agent, watched separately from the config it never touches.
  startWatchingAgents();
  // The instructions an agent reads to declare a deliverable, refreshed to whatever this version
  // ships. Not awaited — nothing in the launch depends on it, and a slow home directory shouldn't
  // hold up the panel.
  void writeDeliverableDoc(context.extensionUri);

  // Marked rather than wrapped: VS Code calls this synchronously, so there's no promise to time the
  // reads inside. The watcher setup below it doesn't count toward the launch.
  perfMark({ phase: 'activate', ms: performance.now() - started });
};

export const deactivate = (): void => {
  stopWatching();
  stopWatchingAgents();
  // Nothing to unwatch — usage has no watchers — but its poll outlives the panel if nothing stops it.
  stopWatchingUsage();
  // Same deal for the session page's poll, and it drops the watched session with it.
  stopWatchingSessionDetail();
};
