// The grid's own toggle. Same control as the metric switch on the Skills tab and the same kind of
// choice — two readings of one set of days — but not the same options: this one picks between how
// much was spent and how many sessions did the spending, where that one picks between tokens and
// money.

import { AGENT_TOOLS, AGENT_TOOL_LABEL, AgentTool } from '../../model/types';
import { ChoiceOption } from '../UsageChoice';
import { GRID_METRICS, GridMetric } from './grid';
import { GRID_METRIC_LABEL } from './grid-labels';

const HINT: Record<GridMetric, string> = {
  tokens: 'Output tokens produced that day, across every session.',
  sessions: 'How many sessions were active that day, whatever they cost.'
};

export const GRID_METRIC_OPTIONS: readonly ChoiceOption<GridMetric>[] = GRID_METRICS.map(
  (metric) => ({
    id: metric,
    label: GRID_METRIC_LABEL[metric],
    hint: HINT[metric]
  })
);

// Which CLI the grid is drawn for. Not a merged series: the two tools delete their history under
// different rules — Claude Code on a `cleanupPeriodDays` sweep, Copilot on nothing it publishes —
// so one run of squares can't carry a caption that is true of both halves.
const TOOL_HINT: Record<AgentTool, string> = {
  claude: 'Sessions under ~/.claude/projects. The window comes from cleanupPeriodDays.',
  copilot: 'Sessions under ~/.copilot/session-state. No documented retention period, so the window is whatever was found.'
};

export const GRID_TOOL_OPTIONS: readonly ChoiceOption<AgentTool>[] = AGENT_TOOLS.map((tool) => ({
  id: tool,
  label: AGENT_TOOL_LABEL[tool],
  hint: TOOL_HINT[tool]
}));
