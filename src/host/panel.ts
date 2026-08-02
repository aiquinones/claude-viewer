import * as vscode from 'vscode';
import { skillRoots } from '../config/paths';
import { buildSnapshot } from '../model/snapshot';
import { ConfigSnapshot, SkillRoot, WebviewMessage } from '../model/types';
import { getWebviewHtml } from './shell-html';
import { workspaceRoot } from './workspace';

// Registered in package.json under contributes.commands — the two have to agree.
export const OPEN_PANEL_COMMAND: string = 'claudeViewer.open';

// The panel's viewType, which VS Code keys serialization off, and the tab label.
export const PANEL_VIEW_TYPE: string = 'claudeViewer';
export const PANEL_TITLE: string = 'Claude Viewer';

// A single save fires several watcher events; this is how long they're coalesced for.
const REFRESH_DEBOUNCE_MS: number = 150;

let panel: vscode.WebviewPanel | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;
let lastSnapshot: ConfigSnapshot | undefined;
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
  panel.onDidDispose(() => {
    stopWatching();
    panel = undefined;
    lastSnapshot = undefined;
    webviewReady = false;
    pendingReveal = undefined;
  });

  void _startWatching();
};

const _onMessage = async (message: WebviewMessage): Promise<void> => {
  if (message.type === 'ready') return _onReady();
  if (message.type === 'refresh') return _push();
  if (message.type === 'openFile') return _openFile(message.path);
  if (message.type === 'surfaceUnavailable') return _surfaceUnavailable(message.title);
};

// Clicking a surface that has no view yet. A notification rather than a line in the panel, so the
// landing page stays a grid of cards and the answer lands where VS Code's other answers do.
const _surfaceUnavailable = async (title: string): Promise<void> => {
  await vscode.window.showInformationMessage(`${title} isn't built yet — it's coming.`);
};

// The webview is listening now, so the snapshot goes out and any reveal that was waiting on it
// follows. Posting the reveal any earlier would drop it on the floor.
const _onReady = async (): Promise<void> => {
  webviewReady = true;
  await _push();

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

// Rebuilds the whole snapshot and hands it to the panel. There are no partial updates.
const _push = async (): Promise<void> => {
  const snapshot: ConfigSnapshot = await buildSnapshot(workspaceRoot());
  lastSnapshot = snapshot;
  await panel?.webview.postMessage({ type: 'snapshot', snapshot });
};

// Opens a SKILL.md in the editor. Only paths the host itself put in the snapshot are honored,
// so the webview can't turn into a way to read arbitrary files.
const _openFile = async (path: string): Promise<void> => {
  const known: boolean = lastSnapshot?.skills.some((skill) => skill.path === path) ?? false;
  if (!known) return;

  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(path));
  await vscode.window.showTextDocument(doc, {
    viewColumn: vscode.ViewColumn.One,
    preview: true,
    selection: new vscode.Range(0, 0, 0, 0)
  });
};

// One watcher per skill root. Config changes mid-session, so the panel follows the disk rather
// than reading once when it opens.
const _startWatching = async (): Promise<void> => {
  const roots: SkillRoot[] = await skillRoots(workspaceRoot());

  for (const root of roots) {
    const pattern: vscode.RelativePattern = new vscode.RelativePattern(
      vscode.Uri.file(root.dir),
      '**/*'
    );
    const watcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(_scheduleRefresh);
    watcher.onDidCreate(_scheduleRefresh);
    watcher.onDidDelete(_scheduleRefresh);
    watchers.push(watcher);
  }
};

export const stopWatching = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

const _scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void _push(), REFRESH_DEBOUNCE_MS);
};
