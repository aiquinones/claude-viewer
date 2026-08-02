import * as vscode from 'vscode';
import { handleUri } from './commands/handle-uri/handle-uri';
import { openSkill } from './commands/open-skill/open-skill';
import { openPanel, stopWatching } from './host/panel';

// Wiring only. Every entry point's body lives under commands/, so what a user can invoke is
// readable from this one screen.
export const activate = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeViewer.open', () => openPanel({ context })),
    vscode.commands.registerCommand('claudeViewer.openSkill', () => void openSkill({ context })),
    vscode.window.registerUriHandler({ handleUri: (uri) => void handleUri({ context, uri }) })
  );
};

export const deactivate = (): void => stopWatching();
