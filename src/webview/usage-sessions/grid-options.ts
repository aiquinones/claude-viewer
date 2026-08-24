// The grid's own toggle, and the only control left on the Sessions tab: everything that changes
// which number the surface reads is in the header's `...` instead.

import { AGENT_TOOLS, AGENT_TOOL_LABEL, AgentTool } from '../../model/types';
import { ChoiceOption } from '../menu/choice-option';

// Which CLI the grid is drawn for. Not a merged series: the two tools delete their history under
// different rules — Claude Code on a `cleanupPeriodDays` sweep, Copilot on nothing it publishes —
// so one run of squares can't carry a caption that is true of both halves.
const TOOL_HINT: Record<AgentTool, string> = {
  claude: 'Sessions under `~/.claude/projects`. The window comes from `cleanupPeriodDays`.',
  copilot:
    'Sessions under `~/.copilot/session-state`. No documented retention period, so the window is whatever was found.'
};

export const GRID_TOOL_OPTIONS: readonly ChoiceOption<AgentTool>[] = AGENT_TOOLS.map((tool) => ({
  id: tool,
  label: AGENT_TOOL_LABEL[tool],
  hint: TOOL_HINT[tool]
}));
