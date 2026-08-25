import { describe, expect, it } from 'vitest';
import {
  buildRadar,
  nearestSpoke,
  Radar,
  radarPath,
  ringPath
} from '@src/webview/session-analysis/radar/radar-geometry';

// The wheel's two claims: a spoke points where its label says it does, and the pointer resolves to
// the spoke a reader would say it was over. Both are invariants rather than coordinates — the size
// and the label room are free to move without rewriting the file.

const SIZE: number = 236;

const radarOf = (count: number, max: number = 100): Radar => buildRadar({ count, max, size: SIZE });

// How close two coordinates have to be to count as the same point.
const CLOSE: number = 5;

describe('buildRadar', () => {
  it('points the first spoke straight up, so the session starts where the reader does', () => {
    const radar: Radar = radarOf(4);
    const top = radar.pointAt({ index: 0, fraction: 1 });

    expect(top.x).toBeCloseTo(radar.center, CLOSE);
    expect(top.y).toBeCloseTo(radar.center - radar.radius, CLOSE);
  });

  it('goes clockwise from there', () => {
    const radar: Radar = radarOf(4);
    const right = radar.pointAt({ index: 1, fraction: 1 });

    expect(right.x).toBeCloseTo(radar.center + radar.radius, CLOSE);
    expect(right.y).toBeCloseTo(radar.center, CLOSE);
  });

  it('puts a value at its share of the radius', () => {
    const radar: Radar = radarOf(4, 100);
    const half = radar.valueAt({ index: 0, value: 50 });

    expect(half.y).toBeCloseTo(radar.center - radar.radius / 2, CLOSE);
  });

  // A session that spent nothing on every stage. Dividing by its own peak would be a divide by
  // zero; the shape collapses to the centre instead.
  it('draws a session that spent nothing at the centre rather than dividing by zero', () => {
    const radar: Radar = radarOf(3, 0);
    const point = radar.valueAt({ index: 0, value: 0 });

    expect(point.x).toBeCloseTo(radar.center, CLOSE);
    expect(point.y).toBeCloseTo(radar.center, CLOSE);
  });

  it('leaves room outside the ring for the labels', () => {
    const radar: Radar = radarOf(3);
    expect(radar.radius).toBeGreaterThan(0);
    expect(radar.radius).toBeLessThan(SIZE / 2);
  });

  // A label on a spoke pointing left has to end at the spoke or it runs off the box; one at the top
  // or bottom is the only case with room on both sides.
  it('hangs each label off the side its spoke has room on', () => {
    const radar: Radar = radarOf(4);

    expect(radar.labelAt(0).anchor).toBe('middle');
    expect(radar.labelAt(1).anchor).toBe('start');
    expect(radar.labelAt(2).anchor).toBe('middle');
    expect(radar.labelAt(3).anchor).toBe('end');
  });

  // The room a label has is what the caller cuts it to. Three o'clock has whatever is left of the
  // box to its right; twelve o'clock spreads both ways and has roughly the whole width. A side
  // label that reported the full width is how a name runs off the edge.
  it('gives a side label less room than one at the top', () => {
    const radar: Radar = radarOf(4);

    expect(radar.labelAt(1).room).toBeLessThan(radar.labelAt(0).room);
    expect(radar.labelAt(1).room).toBeGreaterThan(0);
  });

  it('never claims room past the edge of the box', () => {
    const radar: Radar = radarOf(8);

    for (let index = 0; index < 8; index += 1) {
      const label = radar.labelAt(index);
      const edge: number = label.anchor === 'start' ? SIZE - label.x : label.anchor === 'end' ? label.x : SIZE;

      expect(label.room).toBeLessThanOrEqual(edge);
    }
  });
});

describe('radarPath', () => {
  it('closes the shape over three or more stages', () => {
    const path: string = radarPath({ radar: radarOf(3), values: [10, 20, 30] });

    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
  });

  // Two stages are a line, not an area. Closing it would draw a shape the data doesn't have, and
  // leaving it open still strokes through both so they read as one series.
  it('leaves two stages open rather than closing a line into an area', () => {
    const path: string = radarPath({ radar: radarOf(2), values: [10, 20] });

    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(false);
    expect(path.match(/[ML]/g)).toHaveLength(2);
  });

  // One stage is a dot, and the vertex the caller already draws is that dot.
  it('draws no path at all for a single stage', () => {
    expect(radarPath({ radar: radarOf(1), values: [10] })).toBe('');
  });
});

describe('ringPath', () => {
  it('makes the grid the polygon the spokes actually make', () => {
    const path: string = ringPath({ radar: radarOf(5), fraction: 1 });
    expect(path.match(/[ML]/g)).toHaveLength(5);
  });

  it('draws no ring under three spokes, where a polygon would be a line', () => {
    expect(ringPath({ radar: radarOf(2), fraction: 1 })).toBe('');
  });
});

describe('nearestSpoke', () => {
  it('resolves a pointer to the spoke it is over', () => {
    const radar: Radar = radarOf(4);

    expect(nearestSpoke({ x: radar.center, y: 10, radar })).toBe(0);
    expect(nearestSpoke({ x: SIZE - 10, y: radar.center, radar })).toBe(1);
    expect(nearestSpoke({ x: radar.center, y: SIZE - 10, radar })).toBe(2);
    expect(nearestSpoke({ x: 10, y: radar.center, radar })).toBe(3);
  });

  // The wrap is the case worth having: a pointer just anticlockwise of straight up is nearest spoke
  // 0, not spoke `count`, which doesn't exist.
  it('wraps past the top rather than naming a spoke that is not there', () => {
    const radar: Radar = radarOf(4);
    const index: number | undefined = nearestSpoke({ x: radar.center - 8, y: 10, radar });

    expect(index).toBe(0);
  });

  it('names no spoke at the dead centre, where every one is equally near', () => {
    const radar: Radar = radarOf(4);
    expect(nearestSpoke({ x: radar.center, y: radar.center, radar })).toBeUndefined();
  });

  it('names no spoke on a wheel that has none', () => {
    const radar: Radar = radarOf(0);
    expect(nearestSpoke({ x: 10, y: 10, radar })).toBeUndefined();
  });

  it('sends every direction to the one spoke on a single-stage wheel', () => {
    const radar: Radar = radarOf(1);

    expect(nearestSpoke({ x: radar.center, y: 10, radar })).toBe(0);
    expect(nearestSpoke({ x: 10, y: SIZE - 10, radar })).toBe(0);
  });
});
