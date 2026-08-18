import { ShutEyes } from './Eyes';
import { RobotHead } from './RobotHead';

// Out cold: eyes shut into two deep Us and three Zs drifting off. The head stays level — a tilt on
// top of the closed eyes and the Zs was a third way of saying asleep, and it cost the silhouette.
//
// The eyes are `ShutEyes`, shared with the waiting robot's dozing half — waiting nods off into this
// exact face, so the two can't be allowed to drift apart.
export const SleepingRobot = () => (
  <RobotHead
    face={<ShutEyes />}
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
