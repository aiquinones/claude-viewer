// A point chasing a target on a rubber band, with friction. Pure math — no DOM, no React, no
// frame loop. Both axes are independent springs, stepped together so a diagonal move stays diagonal.

export interface Point {
  x: number;
  y: number;
}

export interface SpringState {
  position: Point;
  velocity: Point;
}

interface StepSpringArgs {
  state: SpringState;
  target: Point;
  // Seconds since the last frame.
  dt: number;
}

// How hard the band pulls, and how fast the motion bleeds off. Together they put the damping ratio
// near 0.63: a jump across the card overshoots ~6% and settles in about 0.6s, and a cursor sweeping
// at 600px/s is trailed by ~50px. Softer than this and the glow stops reading as attached to the
// cursor — at 130/16 the same sweep leaves it 66px behind, a third of a card.
const STIFFNESS: number = 180;
const DAMPING: number = 17;

// A 60Hz frame is two of these. Integrating in fixed slices means a long frame is more steps rather
// than one bigger one — a single 200ms step at this stiffness would fling the glow off the card.
const SUBSTEP: number = 1 / 120;

// A backgrounded tab hands back one enormous dt. Past this the spring is simply late, and replaying
// every skipped slice would burn a visible pause catching up.
const MAX_STEP: number = 1 / 12;

// Settled: within half a pixel of the target and all but stopped.
const REST_DISTANCE: number = 0.5;
const REST_SPEED: number = 2;

export const stepSpring = ({ state, target, dt }: StepSpringArgs): SpringState => {
  let positionX: number = state.position.x;
  let positionY: number = state.position.y;
  let velocityX: number = state.velocity.x;
  let velocityY: number = state.velocity.y;

  let remaining: number = Math.min(dt, MAX_STEP);

  while (remaining > 0) {
    const step: number = Math.min(SUBSTEP, remaining);

    velocityX += (STIFFNESS * (target.x - positionX) - DAMPING * velocityX) * step;
    velocityY += (STIFFNESS * (target.y - positionY) - DAMPING * velocityY) * step;
    positionX += velocityX * step;
    positionY += velocityY * step;

    remaining -= step;
  }

  return {
    position: { x: positionX, y: positionY },
    velocity: { x: velocityX, y: velocityY }
  };
};

interface IsAtRestArgs {
  state: SpringState;
  target: Point;
}

// Both conditions are needed: mid-overshoot the glow passes right through its target at speed.
export const isAtRest = ({ state, target }: IsAtRestArgs): boolean =>
  distance({ x: target.x - state.position.x, y: target.y - state.position.y }) < REST_DISTANCE &&
  distance(state.velocity) < REST_SPEED;

const distance = (point: Point): number => Math.hypot(point.x, point.y);
