import * as vscode from 'vscode';
import { readTextFile } from '../config/read';
import { ConfigError, Result } from '../config/result';
import { ViewerSettings } from '../model/settings/settings';
import { loadSkillBody } from '../model/skill-body';
import {
  AgentColors,
  AgentSession,
  ConfigSnapshot,
  FileBody,
  SkillGraph,
  WebviewMessage
} from '../model/types';
import { UsageReport } from '../model/usage/types';
import {
  currentAgentColors,
  onDidChangeAgentColors,
  pruneAgentColors,
  setAgentColor
} from './agent-colors-store';
import {
  cachedAgents,
  currentAgents,
  onDidChangeAgents,
  refreshAgents,
  setAgentPollMode
} from './agents-store';
import {
  cachedSnapshot,
  currentSnapshot,
  onDidChangeSnapshot,
  refreshSnapshot
} from './config-store';
import {
  currentSettings,
  onDidChangeSettings,
  revealSettings,
  writeEstimator,
  writeUsageSettings
} from './settings-store';
import { focusAgent } from './focus-agent/focus-agent';
import { currentSkillGraph } from './skill-graph-store';
import {
  currentUsage,
  onDidChangeUsage,
  reaggregateUsage,
  refreshUsage,
  setUsagePollMode
} from './usage-store';
import { getWebviewHtml } from './shell-html';

// Registered in package.json under contributes.commands — the two have to agree.
export const LAUNCH_COMMAND: string = 'claudeViewer.launch';

// The panel's viewType, which VS Code keys serialization off, and the tab label.
export const PANEL_VIEW_TYPE: string = 'claudeViewer';
export const PANEL_TITLE: string = 'Claude Viewer';

// The one surface whose rows go stale on their own, so the one that asks for the fast poll. Has to
// match the `id` of its SURFACES entry — same agreement as a command id and package.json.
const AGENTS_SURFACE: string = 'active-agents';

// The other surface that goes stale on its own, on a much slower clock. Same agreement with its
// SURFACES entry.
const USAGE_SURFACE: string = 'usage';

let panel: vscode.WebviewPanel | undefined;
let snapshotSubscription: vscode.Disposable | undefined;
let settingsSubscription: vscode.Disposable | undefined;
let agentsSubscription: vscode.Disposable | undefined;
let usageSubscription: vscode.Disposable | undefined;
let colorsSubscription: vscode.Disposable | undefined;
// The webview can't hear anything until it has booted and said so.
let webviewReady: boolean = false;
// A reveal that arrived before that, held until it can be delivered.
let pendingReveal: PendingReveal | undefined;
let revealNonce: number = 0;
// Which surface the webview is showing, `undefined` for the landing page. Only the agents poll
// reads it, but the webview reports every surface — the next one that goes stale gets it free.
let visibleSurface: string | undefined;

// One skill to select, and optionally one heading inside it to land on.
interface PendingReveal {
  path: string;
  section?: string;
}

interface OpenPanelArgs {
  context: vscode.ExtensionContext;
  // Path of the skill to select once the panel is up.
  revealPath?: string;
  // A heading inside it, as a vscode:// link named it. The webview does the matching — the host
  // has no idea what's in the file it's pointing at.
  revealSection?: string;
}

// Where the panel opens: an empty editor group right of the focused one if there is one, else the
// focused group itself — which is column One when nothing is open at all. Not `Beside`, which means
// "a new column right of the active one" rather than "next to the editor", so two columns always
// became three.
const _panelColumn = (): vscode.ViewColumn => {
  const active: vscode.ViewColumn = vscode.window.tabGroups.activeTabGroup.viewColumn;
  const empty: vscode.TabGroup | undefined = vscode.window.tabGroups.all
    .filter((group) => group.viewColumn > active && group.tabs.length === 0)
    .sort((one, other) => one.viewColumn - other.viewColumn)[0];

  return empty?.viewColumn ?? vscode.ViewColumn.Active;
};

export const openPanel = ({ context, revealPath, revealSection }: OpenPanelArgs): void => {
  const asked: PendingReveal | undefined = revealPath
    ? { path: revealPath, section: revealSection }
    : undefined;

  if (panel) {
    // No column: reveal it where it already is. Passing one *moves* the panel, so `Beside` walked
    // it one column right every time the command ran.
    panel.reveal();
    if (asked) void _reveal(asked);
    return;
  }

  pendingReveal = asked;
  webviewReady = false;

  panel = vscode.window.createWebviewPanel(
    PANEL_VIEW_TYPE,
    PANEL_TITLE,
    _panelColumn(),
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'dist'),
        vscode.Uri.joinPath(context.extensionUri, 'media')
      ]
    }
  );

  // Tab icon. Must be an image file — iconPath rejects ThemeIcon — and VS Code doesn't
  // recolor it, so each theme gets its own stroke.
  panel.iconPath = {
    light: vscode.Uri.joinPath(context.extensionUri, 'resources', 'panel-icon-light.svg'),
    dark: vscode.Uri.joinPath(context.extensionUri, 'resources', 'panel-icon-dark.svg')
  };

  panel.webview.html = getWebviewHtml({
    webview: panel.webview,
    extensionUri: context.extensionUri
  });
  panel.webview.onDidReceiveMessage(_onMessage);

  // The store owns the watchers; the panel just listens while it's open.
  snapshotSubscription = onDidChangeSnapshot((snapshot) => void _post(snapshot));
  // Its own channel: a budget changing shouldn't re-walk the disk for a snapshot nothing asked for.
  // The scope setting decides which turns the usage surface counts, so a change re-aggregates what's
  // already in hand — no disk, and the store posts the result on its own message.
  settingsSubscription = onDidChangeSettings((settings) => {
    void _postSettings(settings);
    reaggregateUsage();
  });
  // Same deal, the other way round: an agent starting shouldn't re-read every skill.
  agentsSubscription = onDidChangeAgents((agents) => void _postAgents(agents));
  // Picking a colour shouldn't cost a disk read, so it rides its own message like the rest.
  colorsSubscription = onDidChangeAgentColors((colors) => void _postAgentColors(colors));
  // And this one is the reason the rule exists: a usage pass reads every transcript on the machine.
  usageSubscription = onDidChangeUsage((report) => void _postUsage(report));

  // A hidden tab still holds its webview — retainContextWhenHidden — so nothing tells the poll to
  // stop except this. Reading the disk every two seconds for a panel nobody is looking at is the
  // whole cost of leaving it out.
  panel.onDidChangeViewState(_updatePollMode);
  _updatePollMode();

  panel.onDidDispose(() => {
    setAgentPollMode('off');
    setUsagePollMode('off');
    visibleSurface = undefined;
    snapshotSubscription?.dispose();
    snapshotSubscription = undefined;
    settingsSubscription?.dispose();
    settingsSubscription = undefined;
    agentsSubscription?.dispose();
    agentsSubscription = undefined;
    colorsSubscription?.dispose();
    colorsSubscription = undefined;
    usageSubscription?.dispose();
    usageSubscription = undefined;
    panel = undefined;
    webviewReady = false;
    pendingReveal = undefined;
  });
};

const _onMessage = async (message: WebviewMessage): Promise<void> => {
  if (message.type === 'ready') return _onReady();
  // Through the stores, so the tree redraws off the same read. One button, both channels: the
  // reader pressing refresh means everything on screen, whichever surface they're looking at.
  if (message.type === 'refresh') {
    return void (await Promise.all([refreshSnapshot(), refreshAgents(), refreshUsage()]));
  }
  if (message.type === 'openFile') return _openFile(message.path);
  if (message.type === 'openAgent') return _openAgent(message.sessionId);
  if (message.type === 'requestBody') return _sendBody(message.path);
  if (message.type === 'requestGraph') return _sendGraph();
  if (message.type === 'surfaceUnavailable') return _surfaceUnavailable(message.title);
  if (message.type === 'surfaceChanged') return _onSurfaceChanged(message.surface);
  if (message.type === 'openSettings') return revealSettings(message.section);
  if (message.type === 'setEstimator') return writeEstimator(message.estimator);
  if (message.type === 'setUsage') {
    return writeUsageSettings({
      metric: message.metric,
      scope: message.scope,
      costBasis: message.costBasis
    });
  }
  if (message.type === 'setAgentColor') {
    return setAgentColor({ sessionId: message.sessionId, color: message.color });
  }
};

const _onSurfaceChanged = (surface: string | undefined): void => {
  visibleSurface = surface;
  _updatePollMode();
};

// How fresh the two live surfaces have to be, which is a question about what's on screen — so it's
// the panel that answers it and each store that acts on it.
const _updatePollMode = (): void => {
  if (!panel?.visible) {
    setAgentPollMode('off');
    setUsagePollMode('off');
    return;
  }

  setAgentPollMode(visibleSurface === AGENTS_SURFACE ? 'live' : 'background');
  // No background rate for this one. Nothing off the surface itself moves fast enough to be worth a
  // pass over every transcript on the machine.
  setUsagePollMode(visibleSurface === USAGE_SURFACE ? 'live' : 'off');
};

// The selected file's text, read on demand rather than shipped with every snapshot. Same path
// check as `_openFile`: only files the host itself found are readable.
//
// A SKILL.md is sent below its frontmatter — the fields above it are already on the entry. A
// CLAUDE.md goes whole: it has no frontmatter, and a `---` at its top is a rule, not a block.
const _sendBody = async (path: string): Promise<void> => {
  if (!_isKnownFile(path)) return;

  const read: Result<string, ConfigError> = _isKnownSkill(path)
    ? await loadSkillBody(path)
    : await readTextFile(path);
  const message: FileBody = read.ok
    ? { path, body: read.value }
    : { path, body: '', error: read.error.message };
  await panel?.webview.postMessage({ type: 'fileBody', ...message });
};

// Who mentions whom, across every listed skill. Built once per snapshot by the store, so asking
// twice costs one message.
const _sendGraph = async (): Promise<void> => {
  const graph: SkillGraph = await currentSkillGraph();
  await panel?.webview.postMessage({ type: 'skillGraph', graph });
};

const _isKnownSkill = (path: string): boolean =>
  cachedSnapshot()?.skills.some((skill) => skill.path === path) ?? false;

// Anything the host itself read — a SKILL.md, a CLAUDE.md, a live agent's transcript — is openable.
const _isKnownFile = (path: string): boolean =>
  _isKnownSkill(path) ||
  (cachedSnapshot()?.systemPrompt.some((file) => file.path === path) ?? false) ||
  cachedAgents().some((agent) => agent.transcriptPath === path);

// Clicking a surface that has no view yet. A notification rather than a line in the panel, so the
// landing page stays a grid of cards and the answer lands where VS Code's other answers do.
const _surfaceUnavailable = async (title: string): Promise<void> => {
  await vscode.window.showInformationMessage(`${title} isn't built yet — it's coming.`);
};

// The webview is listening now, so the snapshot goes out and any reveal that was waiting on it
// follows. Posting the reveal any earlier would drop it on the floor.
const _onReady = async (): Promise<void> => {
  webviewReady = true;
  await _postSettings(currentSettings());
  await _postAgentColors(currentAgentColors());
  await _post(await currentSnapshot());
  await _postAgents(await currentAgents());

  const waiting: PendingReveal | undefined = pendingReveal;
  pendingReveal = undefined;
  if (waiting) await _reveal(waiting);
};

const _reveal = async ({ path, section }: PendingReveal): Promise<void> => {
  if (!webviewReady) {
    pendingReveal = { path, section };
    return;
  }

  revealNonce += 1;
  await panel?.webview.postMessage({ type: 'reveal', path, section, nonce: revealNonce });
};

// Whole snapshot, no partial updates. Posting before `ready` goes nowhere, and `ready` sends the
// current one anyway.
const _post = async (snapshot: ConfigSnapshot): Promise<void> => {
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'snapshot', snapshot });
};

const _postSettings = async (settings: ViewerSettings): Promise<void> => {
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'settings', settings });
};

const _postUsage = async (report: UsageReport): Promise<void> => {
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'usage', report });
};

// Every agent list is also the answer to which colours are still worth keeping, so the prune rides
// along here rather than on a clock of its own.
const _postAgents = async (agents: AgentSession[]): Promise<void> => {
  await pruneAgentColors(agents.map((agent) => agent.sessionId));
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'agents', agents });
};

const _postAgentColors = async (colors: AgentColors): Promise<void> => {
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'agentColors', colors });
};

// Goes to the running agent: the Claude Code tab holding that session, or the terminal it was
// started in. A session out of this window's reach opens its log instead, which is what clicking a
// row did before this existed — so there is no failure to report, and nothing is said about it.
//
// The webview names a session and never a path. The host resolves it against its own cache, the
// same rule `_openFile` follows.
const _openAgent = async (sessionId: string): Promise<void> => {
  const agent: AgentSession | undefined = cachedAgents().find(
    (session) => session.sessionId === sessionId
  );
  if (!agent) return;

  if (await focusAgent(agent)) return;
  await _openFile(agent.transcriptPath);
};

// Opens a config file in the editor. Only paths the host itself put in the snapshot are honored,
// so the webview can't turn into a way to read arbitrary files.
const _openFile = async (path: string): Promise<void> => {
  if (!_isKnownFile(path)) return;

  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(path));
  await vscode.window.showTextDocument(doc, {
    viewColumn: _fileColumn(),
    preview: true,
    selection: new vscode.Range(0, 0, 0, 0)
  });
};

// Where a file opens: any column but the panel's, so opening one doesn't bury the panel that
// asked for it. Not `Beside` — clicking inside the panel makes the panel's column the active one,
// so Beside would open a new column to its right, which is the bug this pair of rules avoids.
const _fileColumn = (): vscode.ViewColumn =>
  panel?.viewColumn === vscode.ViewColumn.One ? vscode.ViewColumn.Two : vscode.ViewColumn.One;
