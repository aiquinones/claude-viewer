import * as vscode from 'vscode';
import { handleUri } from './commands/handle-uri/handle-uri';
import { OPEN_SKILL_COMMAND, openSkill } from './commands/open-skill/open-skill';
import { startWatching, stopWatching } from './host/config-store';
import { OPEN_PANEL_COMMAND, openPanel } from './host/panel';
import { registerTree } from './host/tree/register-tree';

// Wiring only. Every entry point's body lives under commands/ or host/, so what a user can invoke
// is readable from this one screen.
export const activate = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand(OPEN_PANEL_COMMAND, () => openPanel({ context })),
    vscode.commands.registerCommand(OPEN_SKILL_COMMAND, () => void openSkill({ context })),
    vscode.window.registerUriHandler({ handleUri: (uri) => void handleUri({ context, uri }) }),
    ...registerTree({ context })
  );

  // The tree is visible without anything being opened, so the watchers start here rather than
  // when the panel opens.
  void startWatching();
};

export const deactivate = (): void => stopWatching();
