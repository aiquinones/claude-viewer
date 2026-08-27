import { costUnitOf, hasCost, NO_COST_REASON } from '../../model/usage/cost-unit';
import { SessionDetail, UsageSummaryData } from '../../model/usage/types';
import { plural } from '../format-size';
import { UsageInfo } from '../UsageInfo';
import { formatCost } from './session-format';

interface SessionHeadlineProps {
  detail: SessionDetail;
  summary: UsageSummaryData;
}

// The session's own total. No `...` beside it: the scope is meaningless for one session, and cost is
// the only figure now — so there is nothing left to ask here.
//
// Its own file because what it prints depends on the CLI: three of them, and one states no
// per-token cost at all.
export const SessionHeadline = ({ detail, summary }: SessionHeadlineProps) => {
  // A dash rather than a figure when the CLI has no cost unit — the same answer the chart below
  // gives, so the page doesn't report a total it then declines to draw.
  const unpriced: boolean = !hasCost(detail.tool);

  return (
    <section className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
      <span
        className={`text-2xl font-semibold tabular-nums${unpriced ? ' text-muted-foreground' : ''}`}
        title={unpriced ? NO_COST_REASON : undefined}
      >
        {unpriced ? '—' : formatCost({ value: costOf(summary, detail), tool: detail.tool })}
      </span>
      <span className="text-xs text-muted-foreground">
        {/* The (i) sits inside the caption rather than beside it, so a panel too narrow for the line
            wraps the words and keeps the icon on "cost" instead of stranding it. */}
        cost <UsageInfo breakdown={summary} /> · {plural(summary.total.turns, 'request')}
      </span>
    </section>
  );
};

const costOf = (summary: UsageSummaryData, detail: SessionDetail): number =>
  costUnitOf(detail.tool) === 'aiu' ? summary.total.nanoAiu : summary.total.usd;
