import { useMemo } from 'react';
import { SessionUsage, UsageHistory } from '../../model/usage/types';
import { Loading } from '../loading/Loading';
import { useNow } from '../useNow';
import { ContributionGrid } from './ContributionGrid';
import { UsageGrid, buildGrid } from './grid';
import { RetentionInfo } from './RetentionInfo';
import { SessionList } from './SessionList';
import { spanLabel } from './grid-labels';

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
}

// Every session on record, twice: as a run of days, and as a list you can search. Both are the same
// `history.sessions` — one rolled up by day, one sorted by activity — and both are already narrowed
// to the scope, which the host applied on the way out of the store.
//
// Both CLIs, on one run of squares. The question the tab answers is when you were working, and that
// is one question however many tools you were working with — so a square is the total and its
// tooltip is where it says which. The x-axis is the only thing that can't be true of both halves,
// since Claude Code deletes transcripts on a schedule and Copilot publishes none: hence the (i),
// which explains a window that is Claude's and appears only while Claude's squares are on the wall.
export const SessionsTab = ({ history, workspaceRoot, onOpenSession }: SessionsTabProps) => {
  const now: number = useNow(AGE_TICK_MS);

  const grid: UsageGrid | undefined = useMemo(() => {
    if (!history) return undefined;

    return buildGrid({
      sessions: history.sessions,
      now: history.scannedAt,
      retentionDays: history.retention.days
    });
  }, [history]);

  if (!history || !grid) {
    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <Loading label="Reading every session on disk…" expectedMs={HISTORY_EXPECTED_MS} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* The (i)'s card is a descendant of this heading, and every one of these rules inherits.
          `HoverCard` resets its own typography for that reason, so the heading can carry them. */}
      <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {spanLabel(grid.weeks.length)}
        {/* Only Claude's window has a rule behind it to explain, and only while its squares are
            what you're looking at — on a machine that has never run it there is no window to
            justify, and a card about `cleanupPeriodDays` would be about nothing on screen. */}
        {grid.byTool.claude > 0 && (
          <RetentionInfo
            retention={history.retention}
            workspaceRoot={workspaceRoot}
            oldestClaudeDays={grid.oldestClaudeDays}
          />
        )}
      </h2>

      <ContributionGrid grid={grid} />

      <SessionList sessions={history.sessions} now={now} onOpen={onOpenSession} />
    </div>
  );
};
