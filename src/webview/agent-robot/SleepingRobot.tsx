import { RobotHead } from './RobotHead';

// Out cold: eyes shut into two deep Us and three Zs drifting off. The head stays level — a tilt on
// top of the closed eyes and the Zs was a third way of saying asleep, and it cost the silhouette.
//
// Cubics rather than the quadratics this started as, and 3 units wide rather than 2.2. Both of
// those are the same bug: the stroke is 2 units, so a curve that shallow or that narrow has its two
// sides overlapping for their whole length, and the round caps leave a notch between them at the
// top — which is a heart. Three wide leaves a clear unit between the sides, and a cubic with both
// handles straight down gets a belly of three quarters of the offset instead of half.
//
// 3 is also the widest they go: the eyes are 6 apart and the head's inside is 14 across, so any
// wider and the two strokes touch each other in the middle.
//
// These are the one place the drawing steps off the icon's weight of 2. A stroke bent through 180
// degrees puts three times as much ink in the same space as the straight tick the icon uses, so at
// a matched width the shut eyes read as the heaviest thing on the face. 1.5 is what makes them
// weigh the same as everyone else's.
export const SleepingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye" strokeWidth={1.5} d="M11.5 16.2C11.5 19.2 14.5 19.2 14.5 16.2" />
        <path className="bot-eye" strokeWidth={1.5} d="M17.5 16.2C17.5 19.2 20.5 19.2 20.5 16.2" />
      </>
    }
    aside={
      <>
        {/* Each Z runs the same rise on its own delay, so they leave one at a time. Smaller and
            lower is newer — the big one at the top is on its way out. The trail has to finish
            inside the box: the top Z rises 2.5 more units than it is drawn at, and a `text` is
            measured from its baseline, so its cap is what decides how much headroom is left. */}
        <Zzz className="bot-z" x={26} y={13} size={4} />
        <Zzz className="bot-z bot-z--2" x={28} y={9} size={5.2} />
        <Zzz className="bot-z bot-z--3" x={29.3} y={5.4} size={6} />
      </>
    }
  />
);

interface ZzzProps {
  className: string;
  x: number;
  y: number;
  size: number;
}

const Zzz = ({ className, x, y, size }: ZzzProps) => (
  <text
    className={className}
    x={x}
    y={y}
    fontSize={size}
    fontWeight={700}
    textAnchor="middle"
    fill="currentColor"
    stroke="none"
  >
    Z
  </text>
);
