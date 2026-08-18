import { AGENT_TOOL_LABEL, AgentTool } from '../model/types';
import { toolsIn } from '../model/usage/aggregate';
import { UsageBreakdown, UsageMetric, UsageScope } from '../model/usage/types';
import { plural } from './format-size';
import { formatAiu, formatTotal, formatUsd, METRIC_LABEL } from './usage-format';
import { METRIC_OPTIONS, SCOPE_OPTIONS } from './usage-options';
import { UsageChoice } from './UsageChoice';

interface UsageSummaryProps {
  breakdown: UsageBreakdown;
  metric: UsageMetric;
  scope: UsageScope;
  onMetric: (metric: UsageMetric) => void;
  onScope: (scope: UsageScope) => void;
}

// The headline, and the two controls that say what it's the headline of. Both write settings rather
// than component state: which number you're reading is part of how you read the surface, and it
// should still be that number tomorrow.
export const UsageSummary = ({
  breakdown,
  metric,
  scope,
  onMetric,
  onScope
}: UsageSummaryProps) => (
  <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {metric === 'cost' ? (
        <CostTotals breakdown={breakdown} />
      ) : (
        <span className="text-2xl font-semibold tabular-nums">
          {formatTotal(breakdown.total, metric)}
        </span>
      )}
      <span className="text-xs text-muted-foreground">
        {METRIC_LABEL[metric].toLowerCase()} · {plural(breakdown.total.turns, 'request')}
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <UsageChoice label="Metric" options={METRIC_OPTIONS} value={metric} onChange={onMetric} />
      <UsageChoice label="Sessions" options={SCOPE_OPTIONS} value={scope} onChange={onScope} />
    </div>
  </section>
);

interface CostTotalsProps {
  breakdown: UsageBreakdown;
}

// One figure per CLI, each in its own unit. There is no combined number: AIU and dollars are
// different units and neither CLI's data defines a conversion, so adding them would invent one.
//
// A CLI that contributed nothing to the window isn't drawn either — a `$0` beside a real figure
// reads as a claim that nothing was spent.
const CostTotals = ({ breakdown }: CostTotalsProps) => {
  const tools: AgentTool[] = toolsIn(breakdown);
  if (tools.length === 0) return <span className="text-2xl font-semibold tabular-nums">—</span>;

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      {tools.map((tool) => (
        <span key={tool} className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tabular-nums">
            {tool === 'claude'
              ? formatUsd(breakdown.byTool[tool].usd)
              : formatAiu(breakdown.byTool[tool].nanoAiu)}
          </span>
          <span className="text-xs text-muted-foreground">{AGENT_TOOL_LABEL[tool]}</span>
        </span>
      ))}
    </div>
  );
};
