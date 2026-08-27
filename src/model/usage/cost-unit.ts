// What a CLI's cost is denominated in. Three CLIs, three answers, and no conversion between any two
// of them is defined by anyone's data — which is why the surface shows one figure per tool rather
// than a combined one.
//
// This exists because the alternative was a `tool === 'claude' ? usd : aiu` at each call site, and
// that made Codex — which has neither — print `0 AIU` and draw a cost curve flat along zero. A
// figure of zero is a reading; Codex's absence of one is not.

import { AgentTool } from '../types';

// `none` is Codex: it bills against a rate-limit window rather than per token, and the window is on
// every `token_count` line waiting for a card of its own. Its tokens still count everywhere tokens
// are the metric — this is only about money.
export const COST_UNIT: Record<AgentTool, 'usd' | 'aiu' | 'none'> = {
  claude: 'usd',
  copilot: 'aiu',
  codex: 'none'
};

export type CostUnit = (typeof COST_UNIT)[AgentTool];

export const costUnitOf = (tool: AgentTool): CostUnit => COST_UNIT[tool];

// Whether a cost figure can be drawn for this CLI at all. The callers that read it are the headline
// totals, the session page's metric chart and its heading.
export const hasCost = (tool: AgentTool): boolean => COST_UNIT[tool] !== 'none';

// Why there is no figure, for the reader who came to the surface in cost mode. One sentence, since
// it sits beside a dash.
export const NO_COST_REASON: string =
  'Codex bills against a rate-limit window rather than per token, so there is no per-session cost to report.';
