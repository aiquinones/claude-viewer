import * as vscode from 'vscode';
import { skillRoots } from './config/paths';
import { buildSnapshot } from './model/snapshot';
import { ConfigSnapshot, SkillRoot, WebviewMessage } from './model/types';
import { getWebviewHtml } from './webview';

let panel: vscode.WebviewPanel | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;
let lastSnapshot: ConfigSnapshot | undefined;

export const activate = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeViewer.open', () => _openPanel(context))
  );
};

export const deactivate = (): void => _stopWatching();

const _openPanel = (context: vscode.ExtensionContext): void => {
  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'claudeViewer',
    'Claude Viewer',
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

  panel.webview.html = getWebviewHtml(panel.webview, context.extensionUri);
  panel.webview.onDidReceiveMessage(_onMessage);
  panel.onDidDispose(() => {
    _stopWatching();
    panel = undefined;
    lastSnapshot = undefined;
  });

  void _startWatching();
};

const _onMessage = async (message: WebviewMessage): Promise<void> => {
  if (message.type === 'ready' || message.type === 'refresh') return _push();
  if (message.type === 'openFile') return _openFile(message.path);
};

// Rebuilds the whole snapshot and hands it to the panel. There are no partial updates.
const _push = async (): Promise<void> => {
  const snapshot: ConfigSnapshot = await buildSnapshot(_workspaceRoot());
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
  const roots: SkillRoot[] = await skillRoots(_workspaceRoot());

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

const _stopWatching = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

// A single save fires several events; coalesce them into one rebuild.
const _scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void _push(), 150);
};

const _workspaceRoot = (): string | undefined =>
  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
