// How far back a window reaches. Matches the Day / Week toggle in Claude Code's own usage panel,
// so the two reconcile.

import { UsageWindow } from './types';

const HOUR_MS: number = 60 * 60 * 1000;

export const WINDOW_MS: Record<UsageWindow, number> = {
  day: 24 * HOUR_MS,
  week: 7 * 24 * HOUR_MS
};

export const WINDOW_LABEL: Record<UsageWindow, string> = {
  day: 'Day',
  week: 'Week'
};

// What the view says under the total. Not "since <date>": the window slides with the clock, and a
// fixed date would read as a boundary that doesn't move.
export const WINDOW_BLURB: Record<UsageWindow, string> = {
  day: 'Last 24 hours',
  week: 'Last 7 days'
};

interface CutoffArgs {
  window: UsageWindow;
  now: number;
}

export const cutoff = ({ window, now }: CutoffArgs): number => now - WINDOW_MS[window];
