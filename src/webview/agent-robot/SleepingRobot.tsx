import { RobotChassis } from './RobotChassis';

// Out cold: head hanging to one side, eyes shut, torso breathing, and three Zs drifting off. The
// head's tilt is a static `rotate` in styles.css and the breathing is a `scale` animation — two
// properties, so they compose instead of one winning the element outright.
export const SleepingRobot = () => (
  <>
    <RobotChassis
      face={
        <>
          <path d="M14.8 15.6q1.7 1.9 3.4 0" />
          <path d="M23.8 15.6q1.7 1.9 3.4 0" />
          <path d="M19.5 21h3" />
        </>
      }
      arms={
        <>
          <path d="M13 30 10 35" />
          <path d="M29 30 32 35" />
        </>
      }
    />

    {/* Each Z runs the same rise on its own delay, so they leave one at a time. Smaller and lower
        is newer — the big one at the top is on its way out. */}
    <Zzz className="bot-z" x={34} y={23} size={5.5} />
    <Zzz className="bot-z bot-z--2" x={37} y={17.5} size={7} />
    <Zzz className="bot-z bot-z--3" x={39.8} y={11.5} size={8.5} />
  </>
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
