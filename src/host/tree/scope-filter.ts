import * as vscode from 'vscode';
import { SCOPES, Scope } from '../../model/types';

// Persisted per workspace, since which scopes are worth seeing depends on the project you opened.
const STATE_KEY: string = 'claudeViewer.hiddenScopes';

// VS Code gives extensions no checkmark in a `...` menu — a contributed item has `when`, `group`
// and `alt`, and nothing else. So each scope is two commands under complementary `when` clauses
// and the label flips between Show and Hide, the way the built-in Explorer toggles work.
export const showCommand = (scope: Scope): string => `claudeViewer.show.${scope}`;
export const hideCommand = (scope: Scope): string => `claudeViewer.hide.${scope}`;
const contextKey = (scope: Scope): string => `claudeViewer.showing.${scope}`;

let hidden: Set<Scope> = new Set();
let memento: vscode.Memento | undefined;

const changeEmitter: vscode.EventEmitter<void> = new vscode.EventEmitter();
export const onDidChangeScopeFilter: vscode.Event<void> = changeEmitter.event;

export const visibleScopes = (): Scope[] => SCOPES.filter((scope) => !hidden.has(scope));

// Empty when nothing is hidden, so the caller can leave the view header alone.
export const filterSummary = (): string => (hidden.size === 0 ? '' : visibleScopes().join(', '));

export const initScopeFilter = async (state: vscode.Memento): Promise<void> => {
  memento = state;
  hidden = new Set(state.get<Scope[]>(STATE_KEY, []));
  await syncContextKeys();
};

interface SetScopeVisibleArgs {
  scope: Scope;
  visible: boolean;
}

export const setScopeVisible = async ({ scope, visible }: SetScopeVisibleArgs): Promise<void> => {
  if (visible) hidden.delete(scope);
  else hidden.add(scope);

  await memento?.update(STATE_KEY, [...hidden]);
  await syncContextKeys();
  changeEmitter.fire();
};

// The context keys are what decide which half of each pair the menu renders, so they have to be
// set at activate too — not only when something is toggled.
const syncContextKeys = async (): Promise<void> => {
  for (const scope of SCOPES) {
    await vscode.commands.executeCommand('setContext', contextKey(scope), !hidden.has(scope));
  }
};
