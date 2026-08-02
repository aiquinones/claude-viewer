import * as vscode from 'vscode';
import { openPanel } from '../panel';

// Hidden from the palette in package.json — it only ever runs from a row's click.
export const REVEAL_NODE_COMMAND: string = 'claudeViewer.revealNode';

interface RevealNodeArgs {
  context: vscode.ExtensionContext;
  path: string;
}

// One nav model, two renderers: a tree click takes the same route the palette and vscode:// links
// take. The tree never renders detail, so there's never two of anything to keep in sync.
export const revealNode = ({ context, path }: RevealNodeArgs): void =>
  openPanel({ context, revealPath: path });
