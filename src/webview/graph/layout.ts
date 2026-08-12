// Turning a SkillGraph into something the simulation can step, and back into screen pixels.
// No React, no DOM.

import { SkillGraph } from '../../model/types';

// One node's place in the simulation. Mutated in place by the stepper — 37 fresh objects a frame
// to keep it pure would be the wrong trade for a sim that runs at 60Hz.
export interface GraphNodeState {
  path: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Drawn radius, which the edges also read so an arrow can stop at the circle rather than under it.
  radius: number;
  // Held by the cursor: forces don't apply and the position is set from outside.
  pinned: boolean;
}

// An edge with its endpoints already resolved to indices, so a step never looks anything up.
export interface GraphLink {
  source: number;
  target: number;
  weight: number;
}

export interface GraphLayout {
  nodes: GraphNodeState[];
  links: GraphLink[];
}

// How far apart the seeds start. Close to the springs' rest length, so the first frames settle
// rather than collapse.
const SEED_SPACING: number = 46;

// A circle's radius grows with how many edges touch it, capped so a hub doesn't swallow the view.
const BASE_RADIUS: number = 5;
const RADIUS_PER_EDGE: number = 1.2;
const MAX_RADIUS: number = 13;

// The angle that makes a spiral fill evenly rather than lining up in arms.
const GOLDEN_ANGLE: number = Math.PI * (3 - Math.sqrt(5));

// Deterministic seeds — a spiral by index, not random — so opening the graph twice gives the same
// picture rather than a new one to re-learn each time.
export const toLayout = (graph: SkillGraph): GraphLayout => {
  const index: Map<string, number> = new Map(
    graph.nodes.map((node, position) => [node.path, position])
  );

  const degrees: Map<string, number> = new Map();
  for (const edge of graph.edges) {
    degrees.set(edge.from, (degrees.get(edge.from) ?? 0) + 1);
    degrees.set(edge.to, (degrees.get(edge.to) ?? 0) + 1);
  }

  const nodes: GraphNodeState[] = graph.nodes.map((node, position) => {
    const radius: number = SEED_SPACING * Math.sqrt(position + 0.5);
    const angle: number = position * GOLDEN_ANGLE;

    return {
      path: node.path,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: nodeRadius(degrees.get(node.path) ?? 0),
      pinned: false
    };
  });

  // An edge whose end isn't a node can't happen — the graph only keeps connected ones — but
  // dropping it here is cheaper than trusting that forever.
  const links: GraphLink[] = graph.edges.flatMap((edge) => {
    const source: number | undefined = index.get(edge.from);
    const target: number | undefined = index.get(edge.to);
    if (source === undefined || target === undefined) return [];
    return [{ source, target, weight: edge.weight }];
  });

  return { nodes, links };
};

export const nodeRadius = (degree: number): number =>
  Math.min(BASE_RADIUS + degree * RADIUS_PER_EDGE, MAX_RADIUS);

// Pan and zoom, applied as one transform around everything.
export interface GraphView {
  panX: number;
  panY: number;
  zoom: number;
}

export const IDENTITY_VIEW: GraphView = { panX: 0, panY: 0, zoom: 1 };

export const MIN_ZOOM: number = 0.4;
export const MAX_ZOOM: number = 2.5;

export interface Point {
  x: number;
  y: number;
}

// The box the graph is drawn in.
export interface Size {
  width: number;
  height: number;
}

interface ToSimArgs {
  // Where the pointer is, in client coordinates.
  client: Point;
  // The svg's box, from getBoundingClientRect.
  bounds: DOMRect;
  view: GraphView;
}

// Client pixels → simulation coordinates. The viewBox is centered on the origin at 1 unit per
// pixel, so the only steps are moving the origin to the middle and undoing the view transform.
export const toSim = ({ client, bounds, view }: ToSimArgs): Point => ({
  x: (client.x - bounds.left - bounds.width / 2 - view.panX) / view.zoom,
  y: (client.y - bounds.top - bounds.height / 2 - view.panY) / view.zoom
});

interface ToLocalArgs {
  point: Point;
  size: Size;
  view: GraphView;
}

// Simulation coordinates → pixels inside the box, for the HTML card that has to sit on a node.
export const toLocal = ({ point, size, view }: ToLocalArgs): Point => ({
  x: size.width / 2 + point.x * view.zoom + view.panX,
  y: size.height / 2 + point.y * view.zoom + view.panY
});
