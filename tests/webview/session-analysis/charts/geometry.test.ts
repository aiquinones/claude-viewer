import { describe, expect, it } from 'vitest';
import {
  buildScale,
  linePath,
  nearestIndex,
  PLOT_PAD,
  Scale,
  xTickIndices
} from '@src/webview/session-analysis/charts/geometry';
import { SeriesPoint } from '@src/webview/session-analysis/charts/series';

const BOX = { width: 400, height: 148 };

const series = (values: number[]): SeriesPoint[] =>
  values.map((value, index) => ({
    id: `p${index}`,
    at: 1_000 + index * 60_000,
    model: 'claude-opus-5',
    value
  }));

// Every number in a path string, in the order it appears. The commands are all `M x y` and
// `C x y x y x y`, so the odd-indexed ones are the y coordinates.
const coordinates = (path: string): number[] =>
  (path.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

const ysOf = (path: string): number[] => coordinates(path).filter((_value, index) => index % 2 === 1);

describe('buildScale', () => {
  it('spreads the points across the plot, inset by the padding', () => {
    const scale: Scale = buildScale({ count: 5, max: 100, box: BOX });

    expect(scale.x(0)).toBe(PLOT_PAD.left);
    expect(scale.x(4)).toBe(BOX.width - PLOT_PAD.right);
    expect(scale.y(0)).toBe(scale.baseline);
    expect(scale.y(100)).toBe(PLOT_PAD.top);
  });

  // A lone point on the left edge reads as the start of a line that got cut off.
  it('centres a series of one', () => {
    const scale: Scale = buildScale({ count: 1, max: 100, box: BOX });
    expect(scale.x(0)).toBeCloseTo(BOX.width / 2, 0);
  });

  // A session that spent nothing draws a flat line on the floor rather than dividing by zero.
  it('survives a series that is all zeros', () => {
    const scale: Scale = buildScale({ count: 3, max: 0, box: BOX });
    expect(scale.y(0)).toBe(scale.baseline);
    expect(Number.isFinite(scale.y(0))).toBe(true);
  });
});

describe('linePath', () => {
  const scale: Scale = buildScale({ count: 6, max: 100, box: BOX });

  // The reason it's a monotone cubic and not a natural spline. A natural spline through a spike
  // overshoots on the way down, which on a context chart would draw the conversation shrinking below
  // where it ever was — and below zero, which it cannot be.
  it('never swings past the values it runs between', () => {
    const points: SeriesPoint[] = series([0, 4, 96, 2, 3, 0]);
    const ys: number[] = ysOf(linePath({ points, scale }));

    const floor: number = scale.y(0);
    const ceiling: number = scale.y(100);

    for (const y of ys) {
      // Larger y is further down the box, so the floor is the maximum.
      expect(y).toBeLessThanOrEqual(floor + 0.001);
      expect(y).toBeGreaterThanOrEqual(ceiling - 0.001);
    }
  });

  // Per segment, which is the stronger claim and the one Fritsch–Carlson actually guarantees: the
  // curve between two points stays between those two points.
  it('keeps each segment inside its own two endpoints', () => {
    const values: number[] = [10, 90, 12, 80, 15];
    const points: SeriesPoint[] = series(values);
    const numbers: number[] = coordinates(linePath({ points, scale }));

    // `M x y` then six numbers per `C`.
    for (let segment = 0; segment < values.length - 1; segment += 1) {
      const start: number = 2 + segment * 6;
      const controls: number[] = [numbers[start + 1], numbers[start + 3]];
      const ends: number[] = [scale.y(values[segment]), scale.y(values[segment + 1])];

      for (const control of controls) {
        expect(control).toBeGreaterThanOrEqual(Math.min(...ends) - 0.001);
        expect(control).toBeLessThanOrEqual(Math.max(...ends) + 0.001);
      }
    }
  });

  it('draws a lone point as a move and nothing else', () => {
    expect(linePath({ points: series([42]), scale })).toBe(`M ${scale.x(0)} ${scale.y(42)}`);
  });

  it('has nothing to draw for an empty series', () => {
    expect(linePath({ points: [], scale })).toBe('');
  });
});

describe('xTickIndices', () => {
  it('labels every point when they all fit', () => {
    const scale: Scale = buildScale({ count: 5, max: 10, box: BOX });
    expect(xTickIndices({ count: 5, scale, minGapPx: 68 })).toEqual([0, 1, 2, 3, 4]);
  });

  // The labels thin out on a long session; the points don't.
  it('thins out rather than crowding', () => {
    const scale: Scale = buildScale({ count: 54, max: 10, box: BOX });
    const ticks: number[] = xTickIndices({ count: 54, scale, minGapPx: 68 });

    expect(ticks[0]).toBe(0);
    expect(ticks.length).toBeLessThanOrEqual(6);
    for (let index = 1; index < ticks.length; index += 1) {
      expect(scale.x(ticks[index]) - scale.x(ticks[index - 1])).toBeGreaterThanOrEqual(68);
    }
  });

  it('has no labels for an empty series', () => {
    const scale: Scale = buildScale({ count: 0, max: 10, box: BOX });
    expect(xTickIndices({ count: 0, scale, minGapPx: 68 })).toEqual([]);
  });
});

describe('nearestIndex', () => {
  const scale: Scale = buildScale({ count: 5, max: 10, box: BOX });

  it('snaps to the closest point', () => {
    expect(nearestIndex({ x: scale.x(2) + 4, count: 5, scale })).toBe(2);
    expect(nearestIndex({ x: scale.x(3) - 4, count: 5, scale })).toBe(3);
  });

  // The pointer can be outside the plot's own padding and still be over the svg.
  it('clamps to the ends', () => {
    expect(nearestIndex({ x: -50, count: 5, scale })).toBe(0);
    expect(nearestIndex({ x: 9_999, count: 5, scale })).toBe(4);
  });
});
