// Fitting a series into a box: where a point lands, and the path through all of them. Pure math, no
// DOM — the same split `graph/layout.ts` and `graph/forces.ts` make.

import { SeriesPoint } from './series';

// The svg's own size. Width is measured from the pane, height is fixed: this is one section of a
// scrolling page, and a chart that grew with the window would push the skills list off the bottom.
export interface PlotBox {
  width: number;
  height: number;
}

export const PLOT_HEIGHT: number = 148;

// Room around the plot. The clock labels go under it; the air above keeps the tallest point's stroke
// and a guide's label off the top edge.
//
// Deliberately not annotated: the type derives from these numbers.
export const PLOT_PAD = { top: 14, right: 2, bottom: 18, left: 2 } as const;

export interface Scale {
  // Index of the point, not its clock — the gap between two points says "next request", not "some
  // time passed". Same rule the bars this replaced followed.
  x: (index: number) => number;
  y: (value: number) => number;
  // The bottom of the plot, which is where an area closes and a zero point sits.
  baseline: number;
}

interface BuildScaleArgs {
  count: number;
  // What the top of the plot means. The caller's, because the context chart has to keep its warn
  // line on the chart where the metric chart just uses its own peak.
  max: number;
  box: PlotBox;
}

export const buildScale = ({ count, max, box }: BuildScaleArgs): Scale => {
  const left: number = PLOT_PAD.left;
  const right: number = Math.max(left, box.width - PLOT_PAD.right);
  const top: number = PLOT_PAD.top;
  const baseline: number = Math.max(top, box.height - PLOT_PAD.bottom);

  // A series of one has no span to spread over, so its point sits in the middle rather than on the
  // left edge, where it would read as the start of a line that got cut off.
  const span: number = right - left;
  const step: number = count > 1 ? span / (count - 1) : 0;
  const first: number = count > 1 ? left : left + span / 2;

  // A session that spent nothing still gets a flat line on the floor rather than a divide by zero.
  const height: number = baseline - top;
  const ceiling: number = max > 0 ? max : 1;

  return {
    x: (index) => first + index * step,
    y: (value) => baseline - (Math.min(value, ceiling) / ceiling) * height,
    baseline
  };
};

interface PathArgs {
  points: SeriesPoint[];
  scale: Scale;
}

// A monotone cubic through the points — the curve never overshoots a value neither of its
// neighbours reached, which a natural spline does. On a spiky series that shows up as a dip below
// zero after a tall point, and a context chart is not allowed to draw the conversation shrinking
// when it didn't.
export const linePath = ({ points, scale }: PathArgs): string => {
  if (points.length === 0) return '';

  const xs: number[] = points.map((_point, index) => scale.x(index));
  const ys: number[] = points.map((point) => scale.y(point.value));
  if (points.length === 1) return `M ${xs[0]} ${ys[0]}`;

  const tangents: number[] = monotoneTangents({ xs, ys });
  let path: string = `M ${xs[0]} ${ys[0]}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const run: number = (xs[i + 1] - xs[i]) / 3;
    path += ` C ${xs[i] + run} ${ys[i] + tangents[i] * run} ${xs[i + 1] - run} ${
      ys[i + 1] - tangents[i + 1] * run
    } ${xs[i + 1]} ${ys[i + 1]}`;
  }

  return path;
};

// The same curve, closed along the floor, so the gradient under it has something to fill.
export const areaPath = ({ points, scale }: PathArgs): string => {
  const line: string = linePath({ points, scale });
  if (!line) return '';

  const first: number = scale.x(0);
  const last: number = scale.x(points.length - 1);
  return `${line} L ${last} ${scale.baseline} L ${first} ${scale.baseline} Z`;
};

interface TangentsArgs {
  xs: number[];
  ys: number[];
}

// Fritsch–Carlson: a segment whose neighbours disagree about direction gets a flat tangent, so the
// curve turns at the point rather than swinging past it. The interior formula is the weighted
// harmonic mean of the two slopes, which is what keeps it inside them.
const monotoneTangents = ({ xs, ys }: TangentsArgs): number[] => {
  const slopes: number[] = [];
  for (let i = 0; i < xs.length - 1; i += 1) {
    const run: number = xs[i + 1] - xs[i];
    slopes.push(run === 0 ? 0 : (ys[i + 1] - ys[i]) / run);
  }

  return xs.map((_x, i) => {
    if (i === 0) return slopes[0];
    if (i === xs.length - 1) return slopes[slopes.length - 1];

    const before: number = slopes[i - 1];
    const after: number = slopes[i];
    if (before * after <= 0) return 0;

    const runBefore: number = xs[i] - xs[i - 1];
    const runAfter: number = xs[i + 1] - xs[i];
    return (
      (3 * (runBefore + runAfter)) /
      ((2 * runAfter + runBefore) / before + (runAfter + 2 * runBefore) / after)
    );
  });
};

interface GridArgs {
  scale: Scale;
  lines: number;
}

// Where the horizontal rules go, top down. Evenly spaced rather than at round values: nothing labels
// them — the numbers are in the hover card — so they're there to give the curve a floor to be read
// against, and the only labelled lines on the chart are the thresholds.
export const gridYs = ({ scale, lines }: GridArgs): number[] => {
  const top: number = PLOT_PAD.top;
  const step: number = (scale.baseline - top) / lines;
  return Array.from({ length: lines + 1 }, (_unused, index) => top + index * step);
};

interface TickArgs {
  count: number;
  scale: Scale;
  // The narrowest two clock labels may sit before one of them is dropped.
  minGapPx: number;
}

// Which points get a clock label under them. Every one of them on a four-turn session, one in twelve
// on a long one — the labels thin out, the points don't.
export const xTickIndices = ({ count, scale, minGapPx }: TickArgs): number[] => {
  if (count <= 1) return count === 1 ? [0] : [];

  const span: number = scale.x(count - 1) - scale.x(0);
  const fits: number = Math.max(2, Math.floor(span / minGapPx) + 1);
  const step: number = Math.max(1, Math.ceil((count - 1) / (fits - 1)));

  const indices: number[] = [];
  for (let index = 0; index < count; index += step) indices.push(index);
  return indices;
};

interface NearestArgs {
  // Pointer position, in the svg's own coordinates.
  x: number;
  count: number;
  scale: Scale;
}

// Which point the pointer is closest to. Inverted rather than searched: x is linear in the index, so
// this is one division whatever the session's length.
export const nearestIndex = ({ x, count, scale }: NearestArgs): number => {
  if (count <= 1) return 0;

  const first: number = scale.x(0);
  const last: number = scale.x(count - 1);
  if (last === first) return 0;

  const fraction: number = (x - first) / (last - first);
  return Math.min(count - 1, Math.max(0, Math.round(fraction * (count - 1))));
};
