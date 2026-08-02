import * as vscode from 'vscode';

// The first workspace folder, or undefined when no folder is open. That's a normal state — it
// just means the project scope has nowhere to come from.
export const workspaceRoot = (): string | undefined =>
  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
