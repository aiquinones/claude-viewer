// Fitting a handful of stages onto a wheel: where each spoke points, where a value lands on it, and
// which spoke the pointer is nearest. Pure math, no DOM — the same split `charts/geometry.ts` makes
// for the curves above it.

// The box is square and fixed, so both radars are the same size whatever the panel is doing and two
// of them sit side by side until the panel is too narrow for that.
export const RADAR_SIZE: number = 280;

// How far outside the outer ring a label sits.
const LABEL_GAP: number = 10;

// What the ring gives up to the labels around it. This is the whole tension in a radar of named
// things: every pixel of radius is a pixel the label at three o'clock doesn't have. This leaves a
// side label about ten characters, which is what a skill name usually is — and it's why the wheel
// doesn't fill its box. Vertically it could; the ring is a circle and the tightest direction wins.
const LABEL_ROOM: number = 62;

// A quarter turn. Spoke 0 points up rather than right, so the first stage of the session is at the
// top where the reader starts.
const QUARTER: number = Math.PI / 2;

export interface RadarPoint {
  x: number;
  y: number;
}

// Which side of a label the text hangs off. A spoke pointing right wants its label starting at the
// spoke; one pointing left wants it ending there, or it runs off the box.
export type LabelAnchor = 'start' | 'middle' | 'end';

export interface RadarLabel extends RadarPoint {
  anchor: LabelAnchor;
  // How much width the text has before it runs off the box. A label at three o'clock has whatever
  // is left of the box to its right; one at the top has the whole width. The caller cuts to fit —
  // the geometry knows the room, and only the caller knows the font.
  room: number;
}

export interface Radar {
  center: number;
  radius: number;
  count: number;
  // Where a spoke points, in radians, clockwise from straight up.
  angleOf: (index: number) => number;
  // A point on a spoke, as a share of the radius.
  pointAt: (args: PointAtArgs) => RadarPoint;
  // The same, for a value read against the chart's top.
  valueAt: (args: ValueAtArgs) => RadarPoint;
  // Where a spoke's label goes, just outside the outer ring.
  labelAt: (index: number) => RadarLabel;
}

interface PointAtArgs {
  index: number;
  // 0 at the centre, 1 on the outer ring.
  fraction: number;
}

interface ValueAtArgs {
  index: number;
  value: number;
}

interface BuildRadarArgs {
  count: number;
  // What the outer ring means. The caller's, the way the curves' `max` is.
  max: number;
  size: number;
}

export const buildRadar = ({ count, max, size }: BuildRadarArgs): Radar => {
  const center: number = size / 2;
  const radius: number = Math.max(0, center - LABEL_ROOM);

  // A single stage has no wheel to spread over, so its one spoke points up. A session that spent
  // nothing still draws a dot at the centre rather than dividing by zero.
  const step: number = count > 0 ? (Math.PI * 2) / count : 0;
  const ceiling: number = max > 0 ? max : 1;

  const angleOf = (index: number): number => index * step - QUARTER;

  const pointAt = ({ index, fraction }: PointAtArgs): RadarPoint => {
    const angle: number = angleOf(index);
    const reach: number = radius * Math.min(Math.max(fraction, 0), 1);
    return { x: center + Math.cos(angle) * reach, y: center + Math.sin(angle) * reach };
  };

  return {
    center,
    radius,
    count,
    angleOf,
    pointAt,
    valueAt: ({ index, value }) => pointAt({ index, fraction: value / ceiling }),
    labelAt: (index) => {
      const angle: number = angleOf(index);
      const reach: number = radius + LABEL_GAP;
      const across: number = Math.cos(angle);
      const x: number = center + across * reach;
      const anchor: LabelAnchor =
        across > UPRIGHT ? 'start' : across < -UPRIGHT ? 'end' : 'middle';

      return {
        x,
        y: center + Math.sin(angle) * reach,
        anchor,
        // A centred label spreads both ways, so its room is twice whichever side is tighter.
        room:
          anchor === 'start' ? size - x : anchor === 'end' ? x : Math.min(x, size - x) * 2
      };
    }
  };
};

// How far off vertical a spoke has to lean before its label stops centring on it. Below this the
// label sits over or under the spoke, which is the only place it has room on both sides.
const UPRIGHT: number = 0.2;

interface PolygonArgs {
  radar: Radar;
  values: number[];
}

// The shape: one vertex per stage. Closed over three or more, where there's an area to fill. Two
// stages are a line, so it's left open — a stroke through both still reads as one series, and a
// filled sliver between two coincident spokes would be nothing at all. One stage is a dot and the
// caller's vertex is already that.
export const radarPath = ({ radar, values }: PolygonArgs): string => {
  if (values.length < 2) return '';

  const path: string = openPath(values.map((value, index) => radar.valueAt({ index, value })));
  return values.length < 3 ? path : `${path} Z`;
};

interface RingArgs {
  radar: Radar;
  fraction: number;
}

// One ring of the grid, as the polygon the spokes actually make. Empty under three spokes, where a
// polygon would be a line — the caller draws a circle there instead.
export const ringPath = ({ radar, fraction }: RingArgs): string => {
  if (radar.count < 3) return '';

  const ring: string = openPath(
    Array.from({ length: radar.count }, (_unused, index) => radar.pointAt({ index, fraction }))
  );
  return `${ring} Z`;
};

// A run of vertices as one path, left open. The shape closes it over three stages and the grid
// always does, so the string building lives here rather than in each of them.
const openPath = (vertices: RadarPoint[]): string =>
  vertices.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

interface RingFractionsArgs {
  rings: number;
}

// Where the grid rings sit, innermost first. Evenly spaced and unlabelled, for the reason the
// curves' grid is: the numbers are in the hover card, and these are here to give the shape
// something to be read against.
export const ringFractions = ({ rings }: RingFractionsArgs): number[] =>
  Array.from({ length: rings }, (_unused, index) => (index + 1) / rings);

interface NearestSpokeArgs {
  // Pointer position, in the svg's own coordinates.
  x: number;
  y: number;
  radar: Radar;
}

// Which spoke the pointer is nearest, by angle alone — how far out it is says nothing about which
// stage it means. Undefined at the dead centre, where every spoke is equally near.
export const nearestSpoke = ({ x, y, radar }: NearestSpokeArgs): number | undefined => {
  if (radar.count === 0) return undefined;

  const across: number = x - radar.center;
  const down: number = y - radar.center;
  if (Math.hypot(across, down) < CENTRE_DEAD_PX) return undefined;

  // Back into the same frame `angleOf` counts in: clockwise from straight up.
  const turns: number = (Math.atan2(down, across) + QUARTER) / (Math.PI * 2);
  const wrapped: number = turns - Math.floor(turns);
  return Math.round(wrapped * radar.count) % radar.count;
};

// The disc in the middle where no spoke is nearer than any other.
const CENTRE_DEAD_PX: number = 6;
