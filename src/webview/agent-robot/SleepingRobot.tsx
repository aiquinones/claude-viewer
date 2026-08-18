import { RobotHead } from './RobotHead';

// Out cold: eyes shut into two arcs and three Zs drifting off. The head's tilt is a static `rotate`
// in styles.css and the doze is a `translate` — two properties, so they compose instead of one
// winning the element outright.
export const SleepingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye" d="M11.8 17.2q1.2 1.8 2.4 0" />
        <path className="bot-eye" d="M17.8 17.2q1.2 1.8 2.4 0" />
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
        <Zzz className="bot-z bot-z--3" x={29.9} y={5.4} size={6} />
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
