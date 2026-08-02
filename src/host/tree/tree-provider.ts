import * as vscode from 'vscode';
import { buildTree } from '../../model/tree/build-tree';
import { ConfigSnapshot, TreeNode, TreeNodeIcon } from '../../model/types';
import { currentSnapshot } from '../config-store';
import { REVEAL_NODE_COMMAND } from './reveal-node';
import { visibleScopes } from './scope-filter';

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
    return buildTree({ snapshot, visibleScopes: visibleScopes() });
  }
}

// Surfaces open by default — there's one of them, and a collapsed tree says nothing.
const collapsibleState = (node: TreeNode): vscode.TreeItemCollapsibleState =>
  node.children ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
