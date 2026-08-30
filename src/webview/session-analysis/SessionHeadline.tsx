import { costUnitOf, noCostReason } from '../../model/usage/cost-unit';
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
// Its own file because what it prints depends on more than the figure: two of the three CLIs are
// priced from a rate table, and a session can have run on a model that table has never heard of.
export const SessionHeadline = ({ detail, summary }: SessionHeadlineProps) => {
  const cost: number = costOf(summary, detail);

  // A turn priced from the table always costs something, so `$0` on a session that ran requests
  // means the table knew none of its models — a dash, the same answer the chart below gives, so the
  // page doesn't report a total it then declines to draw. A session that priced some of its turns
  // keeps its figure and names the models it missed in the card.
  const unpriced: boolean =
    costUnitOf(detail.tool) === 'usd' && cost === 0 && summary.total.turns > 0;

  return (
    <section className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
      <span
        className={`text-2xl font-semibold tabular-nums${unpriced ? ' text-muted-foreground' : ''}`}
        title={unpriced ? noCostReason(summary.unpricedModels) : undefined}
      >
        {unpriced ? '—' : formatCost({ value: cost, tool: detail.tool })}
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
