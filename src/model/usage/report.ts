// Every window at once. The toggle in the panel then costs nothing — no round trip, no second scan —
// and the message stays a few dozen numbers instead of the couple of thousand turns behind them.

import { aggregateUsage } from './aggregate';
import {
  UsageBreakdown,
  UsageCostBasis,
  UsageReport,
  UsageScope,
  UsageWindow,
  UsageTurn,
  USAGE_WINDOWS
} from './types';
import { WINDOW_MS } from './window';

// The widest window there is, which is how far back a scan has to read.
export const WIDEST_WINDOW_MS: number = Math.max(...Object.values(WINDOW_MS));

interface BuildUsageReportArgs {
  turns: UsageTurn[];
  now: number;
  scope: UsageScope;
  workspaceRoot: string | undefined;
  costBasis: UsageCostBasis;
}

export const buildUsageReport = ({
  turns,
  now,
  scope,
  workspaceRoot,
  costBasis
}: BuildUsageReportArgs): UsageReport => {
  const windows = {} as Record<UsageWindow, UsageBreakdown>;

  for (const window of USAGE_WINDOWS) {
    windows[window] = aggregateUsage({
      turns,
      window,
      now,
      scope,
      workspaceRoot,
      costBasis
    });
  }

  return { windows, scannedAt: now };
};
