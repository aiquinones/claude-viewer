import * as vscode from 'vscode';
import { perfPhase } from '../model/perf/recorder';
import { UsageCache } from '../model/usage/incremental';
import { loadUsageTurns } from '../model/usage/load';
import { buildUsageReport, WIDEST_WINDOW_MS } from '../model/usage/report';
import { UsageReport, UsageTurn } from '../model/usage/types';
import { currentSettings } from './settings-store';
import { workspaceRoot } from './workspace';

// Usage is its own channel for the reason agents and settings are, and more so: this one reads every
// transcript on the machine. A skill file saving must not cost that, and neither must an agent
// starting.
//
// There are no watchers here. A transcript is appended to on every turn of every running agent, so a
// watcher would fire constantly and each firing would re-read the file it fired for. The poll below
// does the same work on a schedule the panel can turn off.

// How often the logs are re-read while the surface is up. Slower than the agents poll by an order of
// magnitude: a row there is a claim about this second, and a number here is a week's total that a
// single turn moves by a fraction of a percent.
//
// Deliberately not annotated — a type here would widen the keys UsagePollMode derives from.
export const USAGE_POLL_MS = {
  // The usage surface is on screen.
  live: 15_000,
  // Anything else. The landing card shows a total too, but nothing on it moves fast enough to spend
  // a disk read on, and opening the surface scans immediately.
  off: 0
} as const;

export type UsagePollMode = keyof typeof USAGE_POLL_MS;

// Everything read so far, keyed by log path, so a pass reads only what was appended since the last.
const cache: UsageCache = new Map();

let turns: UsageTurn[] = [];
let report: UsageReport | undefined;
let pollMode: UsagePollMode = 'off';
let pollTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<UsageReport> = new vscode.EventEmitter();

export const onDidChangeUsage: vscode.Event<UsageReport> = changeEmitter.event;

export const currentUsage = async (): Promise<UsageReport> => report ?? refreshUsage();

export const refreshUsage = async (): Promise<UsageReport> => {
  const since: number = Date.now() - WIDEST_WINDOW_MS;
  turns = await perfPhase('usage', () => loadUsageTurns({ since, cache }));
  return publish();
};

// The same numbers again from the turns already in hand — no disk. What a settings change costs:
// the scope decides which turns count, which is not a question the disk has an opinion about.
//
// Undefined before the first scan. An empty report there would draw a total of zero, which is a
// claim, where nothing drawn yet is the truth.
export const reaggregateUsage = (): UsageReport | undefined => (report ? publish() : undefined);

const publish = (): UsageReport => {
  const next: UsageReport = buildUsageReport({
    turns,
    now: Date.now(),
    scope: currentSettings().usage.scope.value,
    workspaceRoot: workspaceRoot()
  });

  report = next;
  changeEmitter.fire(next);
  return next;
};

// What the panel is showing. Same arrangement as the agents poll — the store owns the timer, the
// panel owns the question of whether anyone is looking.
//
// Entering a polling mode reads now. The interval is the gap between passes, not the wait before the
// first one — scheduling instead meant arriving at the surface cost a full 15s of nothing, which is
// two orders of magnitude more than the scan it was waiting for.
export const setUsagePollMode = (mode: UsagePollMode): void => {
  if (mode === pollMode) return;
  pollMode = mode;

  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;

  // The pass starts here rather than inside schedulePoll, which poll() calls when it finishes — a
  // pass kicked off in there would recurse without ever yielding to the timer. A mode that doesn't
  // poll has had its timer cleared above and wants nothing else.
  if (USAGE_POLL_MS[mode] !== 0) void poll();
};

// Chained off the end of each pass rather than an interval, so a slow disk can't stack passes up
// behind each other.
const schedulePoll = (): void => {
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;

  const interval: number = USAGE_POLL_MS[pollMode];
  if (interval === 0) return;

  pollTimer = setTimeout(() => void poll(), interval);
};

const poll = async (): Promise<void> => {
  await refreshUsage();
  schedulePoll();
};

export const stopWatchingUsage = (): void => {
  setUsagePollMode('off');
};
