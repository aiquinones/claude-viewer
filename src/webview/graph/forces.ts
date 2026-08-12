// One step of the force simulation. Pure math over the arrays it's handed — no DOM, no React, no
// frame loop, the same split `glow/spring.ts` uses.

import { GraphLink, GraphNodeState } from './layout';

// Every node pushes every other away, inverse-square. 37 nodes is 666 pairs, so a quadtree would be
// the only clever code in the file and would buy nothing.
const REPULSION: number = 1_100_000;

// Two nodes on top of each other would divide by nothing, so the distance has a floor.
const MIN_DISTANCE: number = 22;

// Edges pull toward this length, harder the more times one skill names the other.
const SPRING: number = 3.2;
const REST_LENGTH: number = 96;
const MAX_WEIGHT_PULL: number = 3;

// A pull toward the origin, so a lightly-tied cluster drifts to the edge instead of to infinity.
const GRAVITY: number = 0.9;

// How fast motion bleeds off. High enough that a shaken graph settles in about a second.
const DAMPING: number = 3.4;

// Fixed slices, so a long frame is more steps rather than one bigger one — a single 200ms step
// would fling the whole graph off the view.
const SUBSTEP: number = 1 / 120;
const MAX_STEP: number = 1 / 12;

// Settled: the total kinetic energy per node, below which nothing visible is still moving.
export const REST_ENERGY: number = 1.2;

interface StepForcesArgs {
  nodes: GraphNodeState[];
  links: GraphLink[];
  // Seconds since the last frame.
  dt: number;
}

// Steps the nodes in place and returns the kinetic energy left in them, which is what the loop
// watches to decide it can stop drawing.
export const stepForces = ({ nodes, links, dt }: StepForcesArgs): number => {
  let remaining: number = Math.min(dt, MAX_STEP);

  while (remaining > 0) {
    const step: number = Math.min(SUBSTEP, remaining);
    applyRepulsion({ nodes, step });
    applySprings({ nodes, links, step });
    integrate({ nodes, step });
    remaining -= step;
  }

  return energy(nodes);
};

interface ApplyRepulsionArgs {
  nodes: GraphNodeState[];
  step: number;
}

const applyRepulsion = ({ nodes, step }: ApplyRepulsionArgs): void => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const left: GraphNodeState = nodes[i];
      const right: GraphNodeState = nodes[j];

      const dx: number = right.x - left.x;
      const dy: number = right.y - left.y;
      const distance: number = Math.max(Math.hypot(dx, dy), MIN_DISTANCE);
      const push: number = (REPULSION / (distance * distance * distance)) * step;

      left.vx -= dx * push;
      left.vy -= dy * push;
      right.vx += dx * push;
      right.vy += dy * push;
    }
  }
};

interface ApplySpringsArgs {
  nodes: GraphNodeState[];
  links: GraphLink[];
  step: number;
}

const applySprings = ({ nodes, links, step }: ApplySpringsArgs): void => {
  for (const link of links) {
    const source: GraphNodeState = nodes[link.source];
    const target: GraphNodeState = nodes[link.target];

    const dx: number = target.x - source.x;
    const dy: number = target.y - source.y;
    const distance: number = Math.max(Math.hypot(dx, dy), MIN_DISTANCE);
    const stiffness: number = SPRING * Math.min(link.weight, MAX_WEIGHT_PULL);
    // Divided by the distance so what's left is the unit vector times the stretch.
    const pull: number = (stiffness * (distance - REST_LENGTH) * step) / distance;

    source.vx += dx * pull;
    source.vy += dy * pull;
    target.vx -= dx * pull;
    target.vy -= dy * pull;
  }
};

interface IntegrateArgs {
  nodes: GraphNodeState[];
  step: number;
}

// Gravity, damping and the move itself. A pinned node is held by the cursor: it takes no forces and
// keeps no velocity, so letting go doesn't fling it.
const integrate = ({ nodes, step }: IntegrateArgs): void => {
  const decay: number = Math.max(0, 1 - DAMPING * step);

  for (const node of nodes) {
    if (node.pinned) {
      node.vx = 0;
      node.vy = 0;
      continue;
    }

    node.vx = (node.vx - node.x * GRAVITY * step) * decay;
    node.vy = (node.vy - node.y * GRAVITY * step) * decay;
    node.x += node.vx * step;
    node.y += node.vy * step;
  }
};

const energy = (nodes: GraphNodeState[]): number => {
  if (nodes.length === 0) return 0;

  let total: number = 0;
  for (const node of nodes) total += node.vx * node.vx + node.vy * node.vy;
  return total / nodes.length;
};
