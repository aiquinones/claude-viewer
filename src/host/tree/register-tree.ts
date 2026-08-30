import * as vscode from 'vscode';
import { TreeNode } from '../../model/types';
import { onDidChangeSnapshot, refreshSnapshot } from '../config-store';
import { REVEAL_NODE_COMMAND, revealNode } from './reveal-node';
import { ConfigTreeProvider } from './tree-provider';

// Registered in package.json under contributes.views — the two have to agree.
export const TREE_VIEW_ID: string = 'claudeViewer.tree';
export const REFRESH_COMMAND: string = 'claudeViewer.refresh';

interface RegisterTreeArgs {
  context: vscode.ExtensionContext;
}

// Everything the sidebar needs, as disposables for activate to own.
export const registerTree = ({ context }: RegisterTreeArgs): vscode.Disposable[] => {
  const provider: ConfigTreeProvider = new ConfigTreeProvider();
  const view: vscode.TreeView<TreeNode> = vscode.window.createTreeView(TREE_VIEW_ID, {
    treeDataProvider: provider
  });

  return [
    view,
    // Only once the read is done. The parts land separately, and the tree draws skills alone — so
    // redrawing on the shell would blank the sidebar and refill it on every save.
    onDidChangeSnapshot((snapshot) => {
      if (snapshot.pending.length === 0) provider.refresh();
    }),
    vscode.commands.registerCommand(REFRESH_COMMAND, () => void refreshSnapshot()),
    vscode.commands.registerCommand(REVEAL_NODE_COMMAND, (path: string) =>
      revealNode({ context, path })
    )
  ];
};
