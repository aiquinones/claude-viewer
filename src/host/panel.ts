import * as vscode from 'vscode';
import { ConfigError, Result } from '../config/result';
import { loadSkillBody } from '../model/skill-body';
import { ConfigSnapshot, SkillBody, WebviewMessage } from '../model/types';
import {
  cachedSnapshot,
  currentSnapshot,
  onDidChangeSnapshot,
  refreshSnapshot
} from './config-store';
import { getWebviewHtml } from './shell-html';

// Registered in package.json under contributes.commands — the two have to agree.
export const OPEN_PANEL_COMMAND: string = 'claudeViewer.open';

// The panel's viewType, which VS Code keys serialization off, and the tab label.
export const PANEL_VIEW_TYPE: string = 'claudeViewer';
export const PANEL_TITLE: string = 'Claude Viewer';

let panel: vscode.WebviewPanel | undefined;
let snapshotSubscription: vscode.Disposable | undefined;
// The webview can't hear anything until it has booted and said so.
let webviewReady: boolean = false;
// A reveal that arrived before that, held until it can be delivered.
let pendingReveal: string | undefined;
let revealNonce: number = 0;

interface OpenPanelArgs {
  context: vscode.ExtensionContext;
  // Path of the skill to select once the panel is up.
  revealPath?: string;
}

export const openPanel = ({ context, revealPath }: OpenPanelArgs): void => {
  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside);
    if (revealPath) void _reveal(revealPath);
    return;
  }

  pendingReveal = revealPath;
  webviewReady = false;

  panel = vscode.window.createWebviewPanel(
    PANEL_VIEW_TYPE,
    PANEL_TITLE,
    vscode.ViewColumn.Beside,
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

  panel.onDidDispose(() => {
    snapshotSubscription?.dispose();
    snapshotSubscription = undefined;
    panel = undefined;
    webviewReady = false;
    pendingReveal = undefined;
  });
};

const _onMessage = async (message: WebviewMessage): Promise<void> => {
  if (message.type === 'ready') return _onReady();
  // Through the store, so the tree redraws off the same read.
  if (message.type === 'refresh') return void (await refreshSnapshot());
  if (message.type === 'openFile') return _openFile(message.path);
  if (message.type === 'requestBody') return _sendBody(message.path);
  if (message.type === 'surfaceUnavailable') return _surfaceUnavailable(message.title);
};

// The selected skill's SKILL.md, read on demand rather than shipped with every snapshot. Same
// path check as `_openFile`: only skills the host itself found are readable.
const _sendBody = async (path: string): Promise<void> => {
  if (!_isKnownSkill(path)) return;

  const read: Result<string, ConfigError> = await loadSkillBody(path);
  const message: SkillBody = read.ok
    ? { path, body: read.value }
    : { path, body: '', error: read.error.message };
  await panel?.webview.postMessage({ type: 'skillBody', ...message });
};

const _isKnownSkill = (path: string): boolean =>
  cachedSnapshot()?.skills.some((skill) => skill.path === path) ?? false;

// Anything the host itself put in the snapshot — a SKILL.md or a CLAUDE.md — is openable.
const _isKnownFile = (path: string): boolean =>
  _isKnownSkill(path) ||
  (cachedSnapshot()?.systemPrompt.some((file) => file.path === path) ?? false);

// Clicking a surface that has no view yet. A notification rather than a line in the panel, so the
// landing page stays a grid of cards and the answer lands where VS Code's other answers do.
const _surfaceUnavailable = async (title: string): Promise<void> => {
  await vscode.window.showInformationMessage(`${title} isn't built yet — it's coming.`);
};

// The webview is listening now, so the snapshot goes out and any reveal that was waiting on it
// follows. Posting the reveal any earlier would drop it on the floor.
const _onReady = async (): Promise<void> => {
  webviewReady = true;
  await _post(await currentSnapshot());

  const waiting: string | undefined = pendingReveal;
  pendingReveal = undefined;
  if (waiting) await _reveal(waiting);
};

const _reveal = async (path: string): Promise<void> => {
  if (!webviewReady) {
    pendingReveal = path;
    return;
  }

  revealNonce += 1;
  await panel?.webview.postMessage({ type: 'reveal', path, nonce: revealNonce });
};

// Whole snapshot, no partial updates. Posting before `ready` goes nowhere, and `ready` sends the
// current one anyway.
const _post = async (snapshot: ConfigSnapshot): Promise<void> => {
  if (!webviewReady) return;
  await panel?.webview.postMessage({ type: 'snapshot', snapshot });
};

// Opens a config file in the editor. Only paths the host itself put in the snapshot are honored,
// so the webview can't turn into a way to read arbitrary files.
const _openFile = async (path: string): Promise<void> => {
  if (!_isKnownFile(path)) return;

  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(path));
  await vscode.window.showTextDocument(doc, {
    viewColumn: vscode.ViewColumn.One,
    preview: true,
    selection: new vscode.Range(0, 0, 0, 0)
  });
};
