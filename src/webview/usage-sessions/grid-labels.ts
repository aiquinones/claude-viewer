// What a square is worth, in words. Its own file because both the readout and the `title` on every
// square print it, and a grid whose tooltip and whose caption disagree is a grid nobody trusts.

import { plural } from '../format-size';
import { formatUsageTokens } from '../usage-format';
import { GridDay, GridMetric } from './grid';

export const GRID_METRIC_LABEL: Record<GridMetric, string> = {
  tokens: 'Tokens',
  sessions: 'Sessions'
};

export const gridDayValue = (day: GridDay, metric: GridMetric): string => {
  if (metric === 'sessions') {
    return day.sessions === 0 ? 'No sessions' : plural(day.sessions, 'session');
  }
  // "No output tokens" rather than "0" — a square that says zero reads like a measurement that came
  // back empty, where the day simply had nothing in it.
  return day.tokens === 0 ? 'No output tokens' : `${formatUsageTokens(day.tokens)} output tokens`;
};
