import * as vscode from 'vscode';
import { openPanel } from '../panel';

// Hidden from the palette in package.json — it only ever runs from a row's click.
export const REVEAL_NODE_COMMAND: string = 'claudeViewer.revealNode';

interface RevealNodeArgs {
  context: vscode.ExtensionContext;
  path: string;
}

// Same route the palette and vscode:// links take — the tree never renders detail.
export const revealNode = ({ context, path }: RevealNodeArgs): void =>
  openPanel({ context, revealPath: path });
