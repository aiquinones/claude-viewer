import * as vscode from 'vscode';
import {
  HistoryCache,
  narrowHistory,
  newHistoryCache,
  scanUsageHistory
} from '../model/usage/history/scan';
import { DEFAULT_RETENTION } from '../model/retention/types';
import { UsageHistory } from '../model/usage/types';
import { currentSettings } from './settings-store';
import { workspaceRoot } from './workspace';

// The Sessions tab's channel. Off `usage-store` rather than a field on its report: that one is a
// seven-day window re-aggregated on a 15s poll, and this is every session on the machine — the two
// answer different questions and neither read should cost the other.
//
// No watchers, for the reason there are none over there: a transcript is appended to on every turn
// of every running agent, so a watcher would fire constantly and each firing would re-read the file
// it fired for.

// How often the corpus is re-read while the Sessions tab is up. Slower than the usage poll by 4x —
// a square on the grid is a whole day's total, and a single turn moves it by a fraction of a
// percent.
//
// Deliberately not annotated — a type here would widen the keys UsageHistoryPollMode derives from.
export const USAGE_HISTORY_POLL_MS = {
  live: 60_000,
  off: 0
} as const;

export type UsageHistoryPollMode = keyof typeof USAGE_HISTORY_POLL_MS;

// Per transcript: an offset and the fold behind it, so a pass reads only what was appended.
const cache: HistoryCache = newHistoryCache();

// Everything, unfiltered. The scope filter is applied on the way out, so flipping the setting costs
// no disk read.
let scanned: UsageHistory | undefined;
let pollMode: UsageHistoryPollMode = 'off';
let pollTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<UsageHistory> = new vscode.EventEmitter();

export const onDidChangeUsageHistory: vscode.Event<UsageHistory> = changeEmitter.event;

// No `currentUsageHistory()` here, unlike the other stores. Nothing outside the Sessions tab shows
// this, so the first scan is the one `setUsageHistoryPollMode('live')` starts when the surface opens
// — a `current*()` nobody calls is a store that never runs, which is exactly how the usage view
// ended up sitting on its loading state.
export const refreshUsageHistory = async (): Promise<UsageHistory> => {
  scanned = await scanUsageHistory({ cache, now: Date.now(), workspaceRoot: workspaceRoot() });
  return publish();
};

// The same sessions again under a different scope — no disk. Undefined before the first scan, where
// an empty history would be a claim and nothing drawn yet is the truth.
export const renarrowUsageHistory = (): UsageHistory | undefined => (scanned ? publish() : undefined);

const publish = (): UsageHistory => {
  const next: UsageHistory = narrowHistory({
    history: scanned ?? { sessions: [], retention: DEFAULT_RETENTION, scannedAt: Date.now() },
    scope: currentSettings().usage.scope.value,
    workspaceRoot: workspaceRoot()
  });

  changeEmitter.fire(next);
  return next;
};

// Same arrangement as the other two polls: the store owns the timer, the panel owns the question of
// whether anyone is looking. Entering a polling mode reads now — the interval is the gap between
// passes, not the wait before the first one.
export const setUsageHistoryPollMode = (mode: UsageHistoryPollMode): void => {
  if (mode === pollMode) return;
  pollMode = mode;

  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;

  if (USAGE_HISTORY_POLL_MS[mode] !== 0) void poll();
};

// Chained off the end of each pass rather than an interval, so a slow disk can't stack passes up
// behind each other.
const schedulePoll = (): void => {
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;

  const interval: number = USAGE_HISTORY_POLL_MS[pollMode];
  if (interval === 0) return;

  pollTimer = setTimeout(() => void poll(), interval);
};

const poll = async (): Promise<void> => {
  await refreshUsageHistory();
  schedulePoll();
};

export const stopWatchingUsageHistory = (): void => {
  setUsageHistoryPollMode('off');
};
