// One session's requests, ready to draw. Pure — the chart reads values off this and does no
// arithmetic of its own beyond fitting them to a box.

import { costUnitOf, isPricedTurn } from '../../../model/usage/cost-unit';
import { usdPartsFor, sumUsdParts, UsdParts } from '../../../model/usage/pricing';
import { ContextPoint, SkillInvocation, UsageTurn } from '../../../model/usage/types';

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

// What each request cost. A turn nothing can price yields no point at all rather than a zero: a
// curve along the floor is a claim that the request was free, where a gap lets the section name the
// model it has no rates for.
export const toCostSeries = (turns: UsageTurn[]): SeriesPoint[] =>
  turns
    .filter(isPricedTurn)
    .map((turn) => ({
      id: turn.id,
      at: turn.at,
      model: turn.model,
      ...(turn.skill ? { skill: turn.skill } : {}),
      value: turnValue(turn)
    }));

// What one request cost. Nano-AIU on a Copilot turn and dollars on the two CLIs that record tokens
// and no price, and a session ran under one CLI — so the chart is one unit, and the heading says
// which. Exported because the stage radar sums the same number over a span of turns: two readings of
// one session that disagreed about what a turn cost would be worse than either.
//
// Zero for a model with no rates. Callers that draw a point filter on `isPricedTurn` first, so what
// reaches this is already priceable — the fallback is for the sums, where leaving a turn out and
// counting it as free come to the same figure.
export const turnValue = (turn: UsageTurn): number => {
  if (costUnitOf(turn.tool) === 'aiu') return turn.nanoAiu ?? 0;

  const parts: UsdParts | undefined = usdPartsFor({ model: turn.model, tokens: turn.tokens });
  if (!parts) return 0;
  return sumUsdParts(parts);
};

// How full the context was at each request. Its own series rather than a field on the cost one:
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
