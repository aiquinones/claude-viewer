import * as vscode from 'vscode';
import {
  BudgetValue,
  DEFAULT_CONTENT_BUDGET,
  DEFAULT_CONTEXT_ERROR_AT,
  DEFAULT_CONTEXT_WARN_AT,
  DEFAULT_CONTEXT_WINDOW_FALLBACK,
  DEFAULT_DESCRIPTION_BUDGET,
  DEFAULT_USAGE_COST_BASIS,
  DEFAULT_USAGE_METRIC,
  DEFAULT_USAGE_SCOPE,
  parseBudgetTokens,
  parseContextTokens,
  parseContextWindows,
  parseOverrides,
  parseUsageCostBasis,
  parseUsageMetric,
  parseUsageScope,
  SettingsSection,
  SettingValue,
  ViewerSettings
} from '../model/settings/settings';
import { UsageCostBasis, UsageMetric, UsageScope } from '../model/usage/types';

// Registered in package.json under contributes.configuration — the section, the keys and the
// defaults there all have to agree with this file.
const SECTION: string = 'claudeViewer';
const DESCRIPTION_KEY: string = 'budgets.skills.description';
const CONTENT_KEY: string = 'budgets.skills.content';
const OVERRIDES_KEY: string = 'budgets.skills.overrides';
const USAGE_METRIC_KEY: string = 'usage.metric';
const USAGE_SCOPE_KEY: string = 'usage.scope';
const USAGE_COST_BASIS_KEY: string = 'usage.costBasis';
const CONTEXT_WARN_KEY: string = 'context.warnAt';
const CONTEXT_ERROR_KEY: string = 'context.errorAt';
const CONTEXT_WINDOW_KEY: string = 'context.window';
const CONTEXT_FALLBACK_KEY: string = 'context.windowFallback';

// What the Settings UI opens filtered to. A plain query rather than `@ext:`, so it doesn't carry a
// second copy of the publisher id.
const settingsQuery = (section: SettingsSection): string => `${SECTION}.${section}`;

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
    },
    usage: {
      metric: readValue({
        config,
        key: USAGE_METRIC_KEY,
        parse: parseUsageMetric,
        fallback: DEFAULT_USAGE_METRIC
      }),
      scope: readValue({
        config,
        key: USAGE_SCOPE_KEY,
        parse: parseUsageScope,
        fallback: DEFAULT_USAGE_SCOPE
      }),
      costBasis: readValue({
        config,
        key: USAGE_COST_BASIS_KEY,
        parse: parseUsageCostBasis,
        fallback: DEFAULT_USAGE_COST_BASIS
      })
    },
    context: {
      warnAt: readValue({
        config,
        key: CONTEXT_WARN_KEY,
        parse: parseContextTokens,
        fallback: DEFAULT_CONTEXT_WARN_AT
      }),
      errorAt: readValue({
        config,
        key: CONTEXT_ERROR_KEY,
        parse: parseContextTokens,
        fallback: DEFAULT_CONTEXT_ERROR_AT
      }),
      windowFallback: readValue({
        config,
        key: CONTEXT_FALLBACK_KEY,
        parse: parseContextTokens,
        fallback: DEFAULT_CONTEXT_WINDOW_FALLBACK
      }),
      windows: parseContextWindows(config.get(CONTEXT_WINDOW_KEY))
    }
  };
};

interface WriteUsageArgs {
  metric?: UsageMetric;
  scope?: UsageScope;
  costBasis?: UsageCostBasis;
}

// The usage surface's toggles write these three keys. This is the extension's own configuration, not
// Claude's — `~/.claude` is still never written — and it goes to the global layer because which
// number you want to look at is a preference rather than a property of the repo.
//
// A write that fails is reported rather than thrown. The toggle draws the value settings.json holds,
// so a rejection nobody catches leaves a control that reads as dead: you press it, nothing moves,
// and there's nothing on screen saying why.
export const writeUsageSettings = async ({
  metric,
  scope,
  costBasis
}: WriteUsageArgs): Promise<void> => {
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(SECTION);

  try {
    if (metric) await config.update(USAGE_METRIC_KEY, metric, vscode.ConfigurationTarget.Global);
    if (scope) await config.update(USAGE_SCOPE_KEY, scope, vscode.ConfigurationTarget.Global);
    if (costBasis) {
      await config.update(USAGE_COST_BASIS_KEY, costBasis, vscode.ConfigurationTarget.Global);
    }
  } catch (error) {
    await reportWriteFailure(error);
  }
};

// What VS Code says when the running window's configuration registry predates the code asking to
// write. It's matched on rather than typed: the failure arrives as a plain Error, and this is the
// one cause with an answer worth offering.
const UNREGISTERED: string = 'is not a registered configuration';

const RELOAD_ACTION: string = 'Reload Window';

// A window registers the keys from package.json when it loads its extensions, and an auto-update
// swaps the code under it without reloading — so the new build's toggles write against the old
// build's registry, which has never heard of them, and every write is refused. That state ends at a
// reload and at nothing else, so the notification offers one rather than describing it.
const reportWriteFailure = async (error: unknown): Promise<void> => {
  const message: string = error instanceof Error ? error.message : String(error);

  if (!message.includes(UNREGISTERED)) {
    await vscode.window.showWarningMessage(`Claude Viewer couldn't save that setting. ${message}`);
    return;
  }

  const picked: string | undefined = await vscode.window.showWarningMessage(
    'Claude Viewer was updated while this window was open, so its settings aren’t registered yet — the Usage toggles can’t save until the window reloads.',
    RELOAD_ACTION
  );
  if (picked === RELOAD_ACTION) {
    await vscode.commands.executeCommand('workbench.action.reloadWindow');
  }
};

export const startWatchingSettings = (): vscode.Disposable =>
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (!event.affectsConfiguration(SECTION)) return;
    changeEmitter.fire(currentSettings());
  });

// Opens the Settings UI on one part of this extension's settings. The webview names the section
// it came from, so a card's CTA lands on the keys it was just explaining rather than on a fixed
// one — the usage menu and the budgets card ask for different halves of the same configuration.
export const revealSettings = async (section: SettingsSection): Promise<void> => {
  await vscode.commands.executeCommand('workbench.action.openSettings', settingsQuery(section));
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

interface ReadValueArgs<Value> {
  config: vscode.WorkspaceConfiguration;
  key: string;
  // Anything settings.json can hold → the value, or undefined to fall through to the next layer.
  parse: (raw: unknown) => Value | undefined;
  fallback: Value;
}

// The same walk `readBudget` does, for a setting whose value isn't a number. Kept separate rather
// than made generic over both: a budget carries `tokens`, and collapsing the two would rename that
// field for the sake of sharing six lines.
const readValue = <Value>({
  config,
  key,
  parse,
  fallback
}: ReadValueArgs<Value>): SettingValue<Value> => {
  const inspected = config.inspect<unknown>(key);

  const workspace: Value | undefined =
    parse(inspected?.workspaceFolderValue) ?? parse(inspected?.workspaceValue);
  if (workspace !== undefined) return { value: workspace, source: 'workspace' };

  const user: Value | undefined = parse(inspected?.globalValue);
  if (user !== undefined) return { value: user, source: 'user' };

  return { value: fallback, source: 'default' };
};
