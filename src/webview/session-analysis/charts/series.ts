// One session's requests, ready to draw. Pure — the chart reads values off this and does no
// arithmetic of its own beyond fitting them to a box.

import { usdPartsFor, sumUsdParts, UsdParts } from '../../../model/usage/pricing';
import { ContextPoint, SkillInvocation, UsageMetric, UsageTurn } from '../../../model/usage/types';

// One point on a chart. Both series produce these, so the chart never learns which of the two it is
// drawing — what a value means is the caller's `format` and `unit`.
export interface SeriesPoint {
  // Stable across a re-render, so a dot can't move to another point.
  id: string;
  at: number;
  value: number;
  model: string;
  // The skill that was running, absent on most turns. Not the same thing as a load — a skill claims
  // every turn until it ends, and its body entered the context once.
  skill?: string;
}

interface ToMetricSeriesArgs {
  turns: UsageTurn[];
  metric: UsageMetric;
}

// What each request was worth under the metric you're reading.
export const toMetricSeries = ({ turns, metric }: ToMetricSeriesArgs): SeriesPoint[] =>
  turns.map((turn) => ({
    id: turn.id,
    at: turn.at,
    model: turn.model,
    ...(turn.skill ? { skill: turn.skill } : {}),
    value: turnValue({ turn, metric })
  }));

export interface TurnValueArgs {
  turn: UsageTurn;
  metric: UsageMetric;
}

// What one request was worth under the metric being read. Cost is dollars on a Claude turn and
// nano-AIU on a Copilot one, and a session ran under one CLI — so the chart is one unit, and the
// heading says which. Exported because the stage radar sums the same number over a span of turns:
// two readings of one session that disagreed about what a turn cost would be worse than either.
export const turnValue = ({ turn, metric }: TurnValueArgs): number => {
  if (metric === 'output-tokens') return turn.tokens.output;
  if (turn.tool === 'copilot') return turn.nanoAiu ?? 0;

  const parts: UsdParts | undefined = usdPartsFor({ model: turn.model, tokens: turn.tokens });
  if (!parts) return 0;
  return sumUsdParts(parts);
};

// How full the context was at each request. Its own series rather than a field on the metric one:
// on the Copilot side the two are read out of different files and don't have to be the same length.
export const toContextSeries = (contexts: ContextPoint[]): SeriesPoint[] =>
  contexts.map((point, index) => ({
    id: `${point.at}-${index}`,
    at: point.at,
    model: point.model,
    value: point.tokens
  }));

// A skill's body entering the context, placed against the points under it.
export interface LoadPoint {
  index: number;
  skills: string[];
}

interface ToLoadPointsArgs {
  points: SeriesPoint[];
  invocations: SkillInvocation[];
}

// The index of the first point at or after each load. Loads landing on one point share it — Copilot
// loads a skill twice five seconds apart for one typed command, and two dots a pixel apart would
// read as two places in the session rather than one.
export const toLoadPoints = ({ points, invocations }: ToLoadPointsArgs): LoadPoint[] => {
  if (points.length === 0) return [];

  const byIndex: Map<number, string[]> = new Map();

  for (const load of invocations) {
    const at: number = points.findIndex((point) => point.at >= load.at);
    // A load after the last request belongs to the end of the session, not to nothing.
    const index: number = at === -1 ? points.length - 1 : at;

    const held: string[] | undefined = byIndex.get(index);
    if (held) {
      if (!held.includes(load.skill)) held.push(load.skill);
    } else byIndex.set(index, [load.skill]);
  }

  return [...byIndex.entries()]
    .map(([index, skills]) => ({ index, skills }))
    .sort((left, right) => left.index - right.index);
};

// The tallest point, which is what a chart with no guides scales to.
export const peakOf = (points: SeriesPoint[]): number =>
  points.reduce((peak, point) => Math.max(peak, point.value), 0);
