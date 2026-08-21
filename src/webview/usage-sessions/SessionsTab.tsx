import { useMemo, useState } from 'react';
import { SessionUsage, UsageHistory } from '../../model/usage/types';
import { Loading } from '../loading/Loading';
import { UsageChoice } from '../UsageChoice';
import { useNow } from '../useNow';
import { ContributionGrid } from './ContributionGrid';
import { GRID_METRIC_OPTIONS } from './grid-options';
import { GridMetric, UsageGrid, buildGrid } from './grid';
import { SessionList } from './SessionList';

// What a first history pass costs. It reads every transcript on the machine rather than the recent
// ones — 87 files and 76MB here, measured at 287ms cold. Every pass after it reads only the bytes
// appended since, which came out at 8ms.
const HISTORY_EXPECTED_MS: number = 1400;

// How often the ages on the rows are recomputed. Nothing here changes on the second — the newest row
// is usually hours old — so this is the slow end of the clock the agent rows run on.
const AGE_TICK_MS: number = 30_000;

interface SessionsTabProps {
  // Undefined until the first pass lands. The tab is what starts it: nothing off this surface shows
  // the history, so nothing else pays for it.
  history: UsageHistory | undefined;
  workspaceRoot: string | undefined;
  onOpenSession: (session: SessionUsage) => void;
  // The grid opens on this metric. The panel never passes it; a story does.
  initialMetric?: GridMetric;
}

// Every session on record, twice: as a year of days, and as a list you can search. Both are the same
// `history.sessions` — one rolled up by day, one sorted by activity.
export const SessionsTab = ({
  history,
  workspaceRoot,
  onOpenSession,
  initialMetric = 'tokens'
}: SessionsTabProps) => {
  // Component state, not a setting. Which of the two numbers a square is painted from is a glance,
  // the same way the window is on the other tab.
  const [metric, setMetric] = useState<GridMetric>(initialMetric);
  const now: number = useNow(AGE_TICK_MS);

  const grid: UsageGrid | undefined = useMemo(
    () =>
      history
        ? buildGrid({ sessions: history.sessions, metric, now: history.scannedAt })
        : undefined,
    [history, metric]
  );

  if (!history || !grid) {
    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <Loading label="Reading every session on disk…" expectedMs={HISTORY_EXPECTED_MS} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Last year
        </h2>
        <UsageChoice
          label="Grid metric"
          options={GRID_METRIC_OPTIONS}
          value={metric}
          onChange={setMetric}
        />
      </div>

      <ContributionGrid grid={grid} metric={metric} />

      <SessionList
        sessions={history.sessions}
        workspaceRoot={workspaceRoot}
        now={now}
        onOpen={onOpenSession}
      />
    </div>
  );
};
