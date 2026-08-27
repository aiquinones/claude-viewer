import * as vscode from 'vscode';
import {
  HistoryCache,
  narrowHistory,
  newHistoryCache,
  scanUsageHistory
} from '../model/usage/history/scan';
import { pathsForSession } from '../model/usage/history/claude';
import { DEFAULT_RETENTION } from '../model/retention/types';
import { SessionUsage, UsageHistory } from '../model/usage/types';
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

// The Sessions tab never calls this — its first scan is the one `setUsageHistoryPollMode('live')`
// starts when the surface opens. It exists for the askers that have no surface: the Analyze Session
// command and a vscode:// link naming one, both of which run with the panel shut.
//
// Scoped, and scanning only if nothing has scanned yet. Scoped because what the picker offers has
// to be what the page can resolve — the surface narrows the same way.
export const currentSessions = async (): Promise<SessionUsage[]> =>
  (renarrowUsageHistory() ?? (await refreshUsageHistory())).sessions;

export const refreshUsageHistory = async (): Promise<UsageHistory> => {
  scanned = await scanUsageHistory({ cache, now: Date.now(), workspaceRoot: workspaceRoot() });
  return publish();
};

// The same sessions again under a different scope — no disk. Undefined before the first scan, where
// an empty history would be a claim and nothing drawn yet is the truth.
export const renarrowUsageHistory = (): UsageHistory | undefined => (scanned ? publish() : undefined);

// Every session the last scan found, unfiltered by scope. What the host resolves a session id
// against — the same rule `_openFile` follows, so a row can only name something the host itself read.
export const cachedSessions = (): SessionUsage[] => scanned?.sessions ?? [];

// Which transcripts hold a session, for the session analysis read. Claude names its files by a uuid
// that isn't the session id, so this is the only way to get from one to the other — and the cache
// already knows, because the fold it built is keyed by both.
export const transcriptPathsFor = (sessionId: string): string[] =>
  pathsForSession(cache.claude, sessionId);

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
