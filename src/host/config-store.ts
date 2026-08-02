import * as vscode from 'vscode';
import { skillRoots } from '../config/paths';
import { buildSnapshot } from '../model/snapshot';
import { ConfigSnapshot, SkillRoot } from '../model/types';
import { workspaceRoot } from './workspace';

// A single save fires several watcher events; this is how long they're coalesced for.
const REFRESH_DEBOUNCE_MS: number = 150;

let snapshot: ConfigSnapshot | undefined;
let watchers: vscode.FileSystemWatcher[] = [];
let refreshTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<ConfigSnapshot> = new vscode.EventEmitter();

// Fires whenever the snapshot is rebuilt. The panel posts it to the webview, the tree redraws.
export const onDidChangeSnapshot: vscode.Event<ConfigSnapshot> = changeEmitter.event;

// The snapshot every reader shares — panel, tree, palette. It lived inside the panel before, which
// meant nothing could read config without a webview open and each command re-read the disk.
export const currentSnapshot = async (): Promise<ConfigSnapshot> => snapshot ?? refreshSnapshot();

// What was last built, without touching the disk. Undefined until something asks for a snapshot.
export const cachedSnapshot = (): ConfigSnapshot | undefined => snapshot;

export const refreshSnapshot = async (): Promise<ConfigSnapshot> => {
  const next: ConfigSnapshot = await buildSnapshot(workspaceRoot());
  snapshot = next;
  changeEmitter.fire(next);
  return next;
};

// One watcher per skill root. Config changes mid-session, so views follow the disk rather than
// reading once at activate.
export const startWatching = async (): Promise<void> => {
  const roots: SkillRoot[] = await skillRoots(workspaceRoot());

  for (const root of roots) {
    const pattern: vscode.RelativePattern = new vscode.RelativePattern(
      vscode.Uri.file(root.dir),
      '**/*'
    );
    const watcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(scheduleRefresh);
    watcher.onDidCreate(scheduleRefresh);
    watcher.onDidDelete(scheduleRefresh);
    watchers.push(watcher);
  }
};

export const stopWatching = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = undefined;
  for (const watcher of watchers) watcher.dispose();
  watchers = [];
};

const scheduleRefresh = (): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void refreshSnapshot(), REFRESH_DEBOUNCE_MS);
};
