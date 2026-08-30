// What a CLI's cost is denominated in, and whether one request of it can be priced at all. Two
// different questions, and the second is the one that decides whether a figure gets drawn.
//
// The unit is a property of the CLI: Copilot writes its own billed figure in AIU, and the other two
// record tokens that `pricing.ts` turns into dollars. No conversion between the two is defined by
// anyone's data, which is why the surface shows one figure per tool rather than a combined one.
//
// Whether there is a figure is a property of the *model*. A CLI ships a new one faster than the
// rate table can follow, and pricing an unknown model at zero is the one error a cost figure can't
// afford — so a turn on a model nothing has rates for draws no point and is named instead.

import { AgentTool } from '../types';
import { ratesFor } from './pricing';
import { UsageTurn } from './types';

export const COST_UNIT: Record<AgentTool, 'usd' | 'aiu'> = {
  claude: 'usd',
  copilot: 'aiu',
  // Codex bills against a rate-limit window rather than per token, so these dollars are an estimate
  // of what the API would have charged. Exactly the same claim the Claude figure makes — a Max plan
  // doesn't pay per token either — and the cost card says so for both.
  codex: 'usd'
};

export type CostUnit = (typeof COST_UNIT)[AgentTool];

export const costUnitOf = (tool: AgentTool): CostUnit => COST_UNIT[tool];

// Whether this request has a cost figure behind it. Copilot always does — it reports its own. The
// dollar CLIs do when the rate table knows the model they ran.
export const isPricedTurn = (turn: UsageTurn): boolean =>
  costUnitOf(turn.tool) === 'aiu' || ratesFor(turn.model) !== undefined;

// The models a set of turns ran that nothing can price, sorted and deduped — the view names these
// rather than quietly pricing them at zero. A list that reorders between refreshes reads as churn.
export const unpricedModelsIn = (turns: UsageTurn[]): string[] => {
  const unpriced: string[] = turns
    .filter((turn) => costUnitOf(turn.tool) === 'usd' && !ratesFor(turn.model))
    .map((turn) => turn.model);

  return [...new Set(unpriced)].sort((left, right) => left.localeCompare(right));
};

// Why there is no figure, for the reader looking at a dash. Names the models, since which one went
// unpriced is the thing that makes it actionable — one sentence, since it sits beside the dash.
export const noCostReason = (models: string[]): string => {
  if (models.length === 0) return 'No requests here have a cost figure behind them.';
  return `No published rates for ${models.join(', ')}, so these tokens count and their cost doesn't.`;
};
