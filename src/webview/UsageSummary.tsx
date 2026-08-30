import { AGENT_TOOL_LABEL, AgentTool } from '../model/types';
import { toolsIn } from '../model/usage/aggregate';
import { CostUnit, costUnitOf, noCostReason } from '../model/usage/cost-unit';
import { UsageBreakdown, UsageWindow } from '../model/usage/types';
import { plural } from './format-size';
import { formatAiu, formatUsd } from './usage-format';
import { WINDOW_OPTIONS } from './usage-options';
import { UsageChoice } from './UsageChoice';
import { UsageInfo } from './UsageInfo';
import { UsageMenu } from './usage-menu/UsageMenu';

interface UsageSummaryProps {
  // Undefined until the first scan lands. The header sits above the tabs, so it's on screen before
  // there is a number to put in it.
  breakdown: UsageBreakdown | undefined;
  window: UsageWindow;
  onWindow: (window: UsageWindow) => void;
}

// The headline, above the tabs rather than inside one: both tabs are readings of the same sessions,
// so the figure and the settings behind it belong to the surface rather than to a half of it.
//
// The window is the one control still on the surface. It says what the number is a total *of*, which
// is the caption to the figure above it — which sessions are counted is in the `...` instead.
export const UsageSummary = ({ breakdown, window, onWindow }: UsageSummaryProps) => (
  <section className="flex flex-col gap-2 px-4 py-3">
    {/* The figures wrap inside their own box rather than being flex items beside the menu, so a
        panel too narrow for them wraps the numbers and leaves the `...` in the corner — as siblings
        the menu was laid out against the whole group and dropped onto a line of its own. */}
    <div className="flex items-start gap-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <Headline breakdown={breakdown} />
        {breakdown && (
          <span className="text-xs text-muted-foreground">
            {/* The (i) sits inside the caption rather than beside it, so a panel too narrow for the
                line wraps the words and keeps the icon on "cost" instead of stranding it. */}
            cost <UsageInfo breakdown={breakdown} /> · {plural(breakdown.total.turns, 'request')}
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
}

// The figure itself. A dash while the scan is out — a zero would be a reading, and there isn't one
// yet; the tab below says what is being waited on.
const Headline = ({ breakdown }: HeadlineProps) => {
  if (!breakdown) {
    return <span className="text-2xl font-semibold tabular-nums text-muted-foreground">—</span>;
  }

  return <CostTotals breakdown={breakdown} />;
};

interface CostTotalsProps {
  breakdown: UsageBreakdown;
}

// One figure per CLI, each in its own unit. There is no combined number: AIU and dollars are
// different units and neither CLI's data defines a conversion, so adding them would invent one.
//
// A CLI that contributed nothing to the window isn't drawn either — a `$0` beside a real figure
// reads as a claim that nothing was spent. A CLI whose turns all ran on models the rate table
// doesn't know draws a dash for the same reason: `$0` there is a worse answer than admitting there
// isn't a figure.
const CostTotals = ({ breakdown }: CostTotalsProps) => {
  const tools: AgentTool[] = toolsIn(breakdown);
  if (tools.length === 0) return <span className="text-2xl font-semibold tabular-nums">—</span>;

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      {tools.map((tool) => (
        <span key={tool} className="flex items-baseline gap-1.5">
          <ToolCost breakdown={breakdown} tool={tool} />
          <span className="text-xs text-muted-foreground">{AGENT_TOOL_LABEL[tool]}</span>
        </span>
      ))}
    </div>
  );
};

interface ToolCostProps {
  breakdown: UsageBreakdown;
  tool: AgentTool;
}

const ToolCost = ({ breakdown, tool }: ToolCostProps) => {
  const unit: CostUnit = costUnitOf(tool);
  const value: number =
    unit === 'usd' ? breakdown.byTool[tool].usd : breakdown.byTool[tool].nanoAiu;

  // A turn priced from the table always costs something, so `$0` on a CLI that ran requests means
  // the table knew none of its models. `0 AIU` is a real reading and is drawn as one — Copilot
  // reports its own figure rather than having one worked out for it.
  if (unit === 'usd' && value === 0) {
    return (
      <span
        className="text-2xl font-semibold tabular-nums text-muted-foreground"
        title={noCostReason(breakdown.unpricedModels)}
      >
        —
      </span>
    );
  }

  return (
    <span className="text-2xl font-semibold tabular-nums">
      {unit === 'usd' ? formatUsd(value) : formatAiu(value)}
    </span>
  );
};
