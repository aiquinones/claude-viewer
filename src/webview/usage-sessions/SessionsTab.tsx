import { useMemo, useState } from 'react';
import { AgentTool } from '../../model/types';
import { SessionUsage, UsageHistory, UsageScope } from '../../model/usage/types';
import { Loading } from '../loading/Loading';
import { useSettings, useSetUsage } from '../settings/SettingsContext';
import { SCOPE_OPTIONS } from '../usage-options';
import { UsageChoice } from '../UsageChoice';
import { useNow } from '../useNow';
import { ContributionGrid } from './ContributionGrid';
import { GRID_METRIC_OPTIONS, GRID_TOOL_OPTIONS } from './grid-options';
import { GridMetric, UsageGrid, buildGrid } from './grid';
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

// Copilot writes no retention rule anywhere, and documents none — so its grid is drawn over whatever
// was found rather than over a window anyone can name.
const COPILOT_RETENTION_DAYS: number = 0;

interface SessionsTabProps {
  // Undefined until the first pass lands. The tab is what starts it: nothing off this surface shows
  // the history, so nothing else pays for it.
  history: UsageHistory | undefined;
  workspaceRoot: string | undefined;
  onOpenSession: (session: SessionUsage) => void;
  // The grid opens on these. The panel never passes them; a story does.
  initialMetric?: GridMetric;
  initialTool?: AgentTool;
}

// Every session on record, twice: as a run of days, and as a list you can search. Both are the same
// `history.sessions` — one rolled up by day, one sorted by activity — and both are already narrowed
// to the scope, which the host applied on the way out of the store.
//
// The grid is one CLI at a time and the list is both. That split is the retention rule: Claude Code
// deletes transcripts on a schedule you can read out of `cleanupPeriodDays`, and Copilot publishes
// no equivalent, so one x-axis can't carry an honest caption for both. A list has no axis — a row
// says which tool it is and that's the whole question.
export const SessionsTab = ({
  history,
  workspaceRoot,
  onOpenSession,
  initialMetric = 'tokens',
  initialTool = 'claude'
}: SessionsTabProps) => {
  // Component state, not settings. Which number a square is painted from and which CLI is on screen
  // are glances, the same way the window is on the other tab.
  const [metric, setMetric] = useState<GridMetric>(initialMetric);
  const [tool, setTool] = useState<AgentTool>(initialTool);
  const now: number = useNow(AGE_TICK_MS);

  // The scope is the exception: it's a setting, shared with the Skills tab, and the host is what
  // applies it — `narrowHistory` runs on the way out of the store, so flipping this re-posts the
  // sessions without reading a single transcript again.
  const scope: UsageScope = useSettings().usage.scope.value;
  const setUsage = useSetUsage();

  const grid: UsageGrid | undefined = useMemo(() => {
    if (!history) return undefined;

    return buildGrid({
      sessions: history.sessions.filter((session) => session.tool === tool),
      metric,
      now: history.scannedAt,
      retentionDays: tool === 'claude' ? history.retention.days : COPILOT_RETENTION_DAYS
    });
  }, [history, metric, tool]);

  if (!history || !grid) {
    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <Loading label="Reading every session on disk…" expectedMs={HISTORY_EXPECTED_MS} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* `uppercase` sits on the label, not the heading: the (i)'s card is a descendant, and
            text-transform inherits — a heading-wide rule shouts the whole explanation. Same split
            CollapsibleHeading makes for the note beside its title. */}
        <h2 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
          <span className="uppercase">{spanLabel(grid.weeks.length)}</span>
          {/* Only Claude's window has a rule behind it to explain. */}
          {tool === 'claude' && (
            <RetentionInfo
              retention={history.retention}
              workspaceRoot={workspaceRoot}
              oldestActiveDays={grid.oldestActiveDays}
            />
          )}
        </h2>
        {/* Wraps rather than shrinks: three word-labelled controls are wider than a docked panel,
            and a control that shrank would truncate the very words that distinguish its options. */}
        <div className="flex flex-wrap items-center gap-2">
          <UsageChoice
            label="Sessions"
            options={SCOPE_OPTIONS}
            value={scope}
            onChange={(next) => setUsage({ scope: next })}
          />
          <UsageChoice label="CLI" options={GRID_TOOL_OPTIONS} value={tool} onChange={setTool} />
          <UsageChoice
            label="Grid metric"
            options={GRID_METRIC_OPTIONS}
            value={metric}
            onChange={setMetric}
          />
        </div>
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
