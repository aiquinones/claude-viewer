import * as vscode from 'vscode';
import { SCOPES, Scope, TreeNode } from '../../model/types';
import { onDidChangeSnapshot, refreshSnapshot } from '../config-store';
import { REVEAL_NODE_COMMAND, revealNode } from './reveal-node';
import {
  filterSummary,
  hideCommand,
  initScopeFilter,
  onDidChangeScopeFilter,
  setScopeVisible,
  showCommand
} from './scope-filter';
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

  const syncHeader = (): void => {
    view.description = filterSummary();
  };

  void initScopeFilter(context.workspaceState).then(syncHeader);

  return [
    view,
    onDidChangeSnapshot(() => provider.refresh()),
    onDidChangeScopeFilter(() => {
      syncHeader();
      provider.refresh();
    }),
    vscode.commands.registerCommand(REFRESH_COMMAND, () => void refreshSnapshot()),
    vscode.commands.registerCommand(REVEAL_NODE_COMMAND, (path: string) =>
      revealNode({ context, path })
    ),
    ...SCOPES.flatMap(scopeToggles)
  ];
};

// Two commands per scope, derived from SCOPES so adding one is still a single edit. Only the
// package.json half has to spell them out.
const scopeToggles = (scope: Scope): vscode.Disposable[] => [
  vscode.commands.registerCommand(
    showCommand(scope),
    () => void setScopeVisible({ scope, visible: true })
  ),
  vscode.commands.registerCommand(
    hideCommand(scope),
    () => void setScopeVisible({ scope, visible: false })
  )
];
