// One session's turns, ready to draw. Pure — the chart reads heights and labels off this and does
// no arithmetic of its own.

import { usdPartsFor, sumUsdParts, UsdParts } from '../../model/usage/pricing';
import {
  SkillInvocation,
  UsageCostBasis,
  UsageMetric,
  UsageTurn
} from '../../model/usage/types';

export interface TurnBar {
  // The turn's own request id, so the key survives a re-sort.
  id: string;
  at: number;
  model: string;
  skill?: string;
  // What this turn is worth under the active metric. Output tokens, or dollars, or nano-AIU — the
  // chart never mixes them because a session ran under one CLI.
  value: number;
  // Of the tallest bar, 0–1. Zero-valued turns still draw a sliver, since a request that happened is
  // not the same as no request.
  height: number;
}

interface ToTurnBarsArgs {
  turns: UsageTurn[];
  metric: UsageMetric;
  costBasis: UsageCostBasis;
}

export const toTurnBars = ({ turns, metric, costBasis }: ToTurnBarsArgs): TurnBar[] => {
  const values: number[] = turns.map((turn) => valueOf({ turn, metric, costBasis }));
  const peak: number = Math.max(...values, 0);

  return turns.map((turn, index) => ({
    id: turn.id,
    at: turn.at,
    model: turn.model,
    ...(turn.skill ? { skill: turn.skill } : {}),
    value: values[index],
    height: peak === 0 ? 0 : values[index] / peak
  }));
};

interface ValueOfArgs {
  turn: UsageTurn;
  metric: UsageMetric;
  costBasis: UsageCostBasis;
}

// Cost is dollars on a Claude turn and nano-AIU on a Copilot one, and the chart is one session — so
// it is one unit, and the axis label says which.
const valueOf = ({ turn, metric, costBasis }: ValueOfArgs): number => {
  if (metric === 'output-tokens') return turn.tokens.output;
  if (turn.tool === 'copilot') return turn.nanoAiu ?? 0;

  const parts: UsdParts | undefined = usdPartsFor({ model: turn.model, tokens: turn.tokens });
  if (!parts) return 0;
  return costBasis === 'output' ? parts.output : sumUsdParts(parts);
};

// A skill load placed against the bars under it: the index of the first turn at or after it. The
// chart draws a tick there, so the spike and the skill that caused it line up.
export interface LoadMark {
  index: number;
  skills: string[];
}

interface ToLoadMarksArgs {
  bars: TurnBar[];
  invocations: SkillInvocation[];
}

// Loads landing on the same turn share one tick — Copilot's double load is five seconds apart and
// would otherwise draw two marks a pixel apart that read as two separate events.
export const toLoadMarks = ({ bars, invocations }: ToLoadMarksArgs): LoadMark[] => {
  if (bars.length === 0) return [];

  const byIndex: Map<number, string[]> = new Map();

  for (const load of invocations) {
    const at: number = bars.findIndex((bar) => bar.at >= load.at);
    // A load after the last turn belongs to the end of the session, not to nothing.
    const index: number = at === -1 ? bars.length - 1 : at;

    const held: string[] | undefined = byIndex.get(index);
    if (held) {
      if (!held.includes(load.skill)) held.push(load.skill);
    } else byIndex.set(index, [load.skill]);
  }

  return [...byIndex.entries()]
    .map(([index, skills]) => ({ index, skills }))
    .sort((left, right) => left.index - right.index);
};
