import * as vscode from 'vscode';
import { FIND_SKILL_COMMAND, findSkill } from './commands/find-skill/find-skill';
import { handleUri } from './commands/handle-uri/handle-uri';
import { initAgentColors } from './host/agent-colors-store';
import { startWatchingAgents, stopWatchingAgents } from './host/agents-store';
import { startWatching, stopWatching } from './host/config-store';
import { LAUNCH_COMMAND, openPanel } from './host/panel';
import { startWatchingSettings } from './host/settings-store';
import { registerTree } from './host/tree/register-tree';
import { stopWatchingUsage } from './host/usage-store';

// Wiring only. Every entry point's body lives under commands/ or host/, so what a user can invoke
// is readable from this one screen.
export const activate = (context: vscode.ExtensionContext): void => {
  // The row colours live in this extension's own storage, so the store needs it before any panel
  // opens.
  initAgentColors(context.globalState);

  context.subscriptions.push(
    vscode.commands.registerCommand(LAUNCH_COMMAND, () => openPanel({ context })),
    vscode.commands.registerCommand(FIND_SKILL_COMMAND, () => void findSkill({ context })),
    vscode.window.registerUriHandler({ handleUri: (uri) => void handleUri({ context, uri }) }),
    startWatchingSettings(),
    ...registerTree({ context })
  );

  // The tree is visible with nothing opened, so watching starts here, not with the panel.
  void startWatching();
  // One file per running agent, watched separately from the config it never touches.
  startWatchingAgents();
};

export const deactivate = (): void => {
  stopWatching();
  stopWatchingAgents();
  // Nothing to unwatch — usage has no watchers — but its poll outlives the panel if nothing stops it.
  stopWatchingUsage();
};
