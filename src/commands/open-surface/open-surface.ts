import * as vscode from 'vscode';
import { openPanel } from '../../host/panel';

// Registered in package.json under contributes.commands — the two have to agree.
export const OPEN_USAGE_COMMAND: string = 'claudeViewer.openUsage';
export const OPEN_ACTIVE_AGENTS_COMMAND: string = 'claudeViewer.openActiveAgents';

// The surface each one lands on. Ids rather than a shared constant for the reason panel.ts keeps
// its own two: SURFACES is webview-only, and the webview validates what it's handed.
export const OPEN_SURFACE_COMMANDS: Record<string, string> = {
  [OPEN_USAGE_COMMAND]: 'usage',
  [OPEN_ACTIVE_AGENTS_COMMAND]: 'active-agents'
};

interface OpenSurfaceArgs {
  context: vscode.ExtensionContext;
  surface: string;
}

// Opens the panel straight onto one surface, skipping the landing page. Nothing is read here — the
// surface asks for what it needs once it's up, which is what its poll modes are keyed on.
export const openSurface = ({ context, surface }: OpenSurfaceArgs): void =>
  openPanel({ context, target: { to: 'surface', surface } });
