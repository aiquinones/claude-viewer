import * as vscode from 'vscode';
import { buildTree } from '../../model/tree/build-tree';
import { ConfigSnapshot, TreeNode, TreeNodeIcon } from '../../model/types';
import { currentSnapshot } from '../config-store';
import { REVEAL_NODE_COMMAND } from './reveal-node';

// Codicon id per marker, with the theme's own problem colors so warnings and errors read the same
// here as they do in the Problems panel.
const ICONS: Record<TreeNodeIcon, vscode.ThemeIcon> = {
  shadowed: new vscode.ThemeIcon('circle-slash'),
  warning: new vscode.ThemeIcon('warning', new vscode.ThemeColor('problemsWarningIcon.foreground')),
  error: new vscode.ThemeIcon('error', new vscode.ThemeColor('problemsErrorIcon.foreground'))
};

// A class because TreeDataProvider is an interface VS Code instantiates against. It knows nothing
// about skills — the adapters in model/tree do, and they never import vscode.
export class ConfigTreeProvider implements vscode.TreeDataProvider<TreeNode> {
  private readonly _emitter: vscode.EventEmitter<void> = new vscode.EventEmitter();
  readonly onDidChangeTreeData: vscode.Event<void> = this._emitter.event;

  refresh(): void {
    this._emitter.fire();
  }

  getTreeItem(node: TreeNode): vscode.TreeItem {
    const item: vscode.TreeItem = new vscode.TreeItem(node.label, collapsibleState(node));
    item.id = node.id;
    item.description = node.description;
    item.tooltip = node.tooltip;
    item.iconPath = node.icon ? ICONS[node.icon] : undefined;

    if (node.revealPath) {
      item.command = {
        command: REVEAL_NODE_COMMAND,
        title: 'Open in Claude Viewer',
        arguments: [node.revealPath]
      };
    }

    return item;
  }

  async getChildren(node?: TreeNode): Promise<TreeNode[]> {
    if (node) return node.children ?? [];

    const snapshot: ConfigSnapshot = await currentSnapshot();
    return buildTree({ snapshot });
  }
}

// Rows with children open by default unless the adapter asks otherwise. Only the first render
// honors this — VS Code keys expansion off TreeItem.id, so the reader's own folding wins after.
const collapsibleState = (node: TreeNode): vscode.TreeItemCollapsibleState => {
  if (!node.children) return vscode.TreeItemCollapsibleState.None;
  return node.collapsed
    ? vscode.TreeItemCollapsibleState.Collapsed
    : vscode.TreeItemCollapsibleState.Expanded;
};
