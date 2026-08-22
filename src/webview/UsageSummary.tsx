import { AGENT_TOOL_LABEL, AgentTool } from '../model/types';
import { toolsIn } from '../model/usage/aggregate';
import { UsageBreakdown, UsageMetric, UsageWindow } from '../model/usage/types';
import { plural } from './format-size';
import { formatAiu, formatTotal, formatUsd, METRIC_LABEL } from './usage-format';
import { WINDOW_OPTIONS } from './usage-options';
import { UsageChoice } from './UsageChoice';
import { UsageMenu } from './usage-menu/UsageMenu';

interface UsageSummaryProps {
  // Undefined until the first scan lands. The header sits above the tabs, so it's on screen before
  // there is a number to put in it.
  breakdown: UsageBreakdown | undefined;
  metric: UsageMetric;
  window: UsageWindow;
  onWindow: (window: UsageWindow) => void;
}

// The headline, above the tabs rather than inside one: both tabs are readings of the same sessions,
// so the figure and the settings behind it belong to the surface rather than to a half of it.
//
// The window is the one control still on the surface. It says what the number is a total *of*, which
// is the caption to the figure above it — everything that changes which number you're reading is in
// the `...` instead.
export const UsageSummary = ({ breakdown, metric, window, onWindow }: UsageSummaryProps) => (
  <section className="flex flex-col gap-2 px-4 py-3">
    {/* The figures wrap inside their own box rather than being flex items beside the menu, so a
        panel too narrow for them wraps the numbers and leaves the `...` in the corner — as siblings
        the menu was laid out against the whole group and dropped onto a line of its own. */}
    <div className="flex items-start gap-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <Headline breakdown={breakdown} metric={metric} />
        {breakdown && (
          <span className="text-xs text-muted-foreground">
            {METRIC_LABEL[metric].toLowerCase()} · {plural(breakdown.total.turns, 'request')}
          </span>
        )}
      </div>
      {/* `mt-1` centres the 24px button against the headline's first line, which is 32px tall —
          `items-start` alone would pin it to the top of the box instead. */}
      <UsageMenu className="ml-auto mt-1 shrink-0" />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Totals for</span>
      <UsageChoice label="Window" options={WINDOW_OPTIONS} value={window} onChange={onWindow} />
    </div>
  </section>
);

interface HeadlineProps {
  breakdown: UsageBreakdown | undefined;
  metric: UsageMetric;
}

// The figure itself. A dash while the scan is out — a zero would be a reading, and there isn't one
// yet; the tab below says what is being waited on.
const Headline = ({ breakdown, metric }: HeadlineProps) => {
  if (!breakdown) {
    return <span className="text-2xl font-semibold tabular-nums text-muted-foreground">—</span>;
  }

  if (metric === 'cost') return <CostTotals breakdown={breakdown} />;

  return (
    <span className="text-2xl font-semibold tabular-nums">
      {formatTotal(breakdown.total, metric)}
    </span>
  );
};

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
