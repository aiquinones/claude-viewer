import * as vscode from 'vscode';
import {
  BudgetValue,
  DEFAULT_CONTENT_BUDGET,
  DEFAULT_DESCRIPTION_BUDGET,
  parseBudgetTokens,
  parseOverrides,
  ViewerSettings
} from '../model/settings/settings';

// Registered in package.json under contributes.configuration — the section, the keys and the
// defaults there all have to agree with this file.
const SECTION: string = 'claudeViewer';
const DESCRIPTION_KEY: string = 'budgets.skills.description';
const CONTENT_KEY: string = 'budgets.skills.content';
const OVERRIDES_KEY: string = 'budgets.skills.overrides';

// What the Settings UI opens filtered to. A plain query rather than `@ext:`, so it doesn't carry a
// second copy of the publisher id.
const SETTINGS_QUERY: string = `${SECTION}.budgets`;

const changeEmitter: vscode.EventEmitter<ViewerSettings> = new vscode.EventEmitter();

// Fires when any claudeViewer.* key changes. The panel posts it on.
export const onDidChangeSettings: vscode.Event<ViewerSettings> = changeEmitter.event;

// Read on demand rather than cached — VS Code holds the configuration itself, so there's nothing
// here worth keeping.
export const currentSettings = (): ViewerSettings => {
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(SECTION);

  return {
    budgets: {
      skills: {
        description: readBudget({
          config,
          key: DESCRIPTION_KEY,
          fallback: DEFAULT_DESCRIPTION_BUDGET
        }),
        content: readBudget({ config, key: CONTENT_KEY, fallback: DEFAULT_CONTENT_BUDGET }),
        overrides: parseOverrides(config.get(OVERRIDES_KEY))
      }
    }
  };
};

export const startWatchingSettings = (): vscode.Disposable =>
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (!event.affectsConfiguration(SECTION)) return;
    changeEmitter.fire(currentSettings());
  });

// Opens the Settings UI on this extension's budgets. The webview asks; the host knows the query.
export const revealSettings = async (): Promise<void> => {
  await vscode.commands.executeCommand('workbench.action.openSettings', SETTINGS_QUERY);
};

interface ReadBudgetArgs {
  config: vscode.WorkspaceConfiguration;
  key: string;
  fallback: number;
}

// The winning layer and the number it set, walked most specific first. `get` would resolve the
// same number but couldn't say which layer it came from — and a value that fails validation has to
// fall through to the next layer, or the source would name a layer whose number isn't being shown.
const readBudget = ({ config, key, fallback }: ReadBudgetArgs): BudgetValue => {
  const inspected = config.inspect<unknown>(key);

  const workspace: number | undefined =
    parseBudgetTokens(inspected?.workspaceFolderValue) ??
    parseBudgetTokens(inspected?.workspaceValue);
  if (workspace !== undefined) return { tokens: workspace, source: 'workspace' };

  const user: number | undefined = parseBudgetTokens(inspected?.globalValue);
  if (user !== undefined) return { tokens: user, source: 'user' };

  return { tokens: fallback, source: 'default' };
};
