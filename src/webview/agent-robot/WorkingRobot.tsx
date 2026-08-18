import { RobotChassis } from './RobotChassis';

// Heads down at the keyboard: the head bobs, the arms tap out of phase with each other, the eyes
// scan the line they're writing and the antenna blips. The busiest of the four, on purpose — this
// is the only row on the surface where something is actually happening.
export const WorkingRobot = () => (
  <>
    <RobotChassis
      face={
        <>
          <path className="bot-eye" d="M16.5 15v2.2" />
          <path className="bot-eye" d="M25.5 15v2.2" />
          <path d="M18.5 20.8h5" />
        </>
      }
      arms={
        <>
          <path className="bot-arm-left" d="M13 29.5 9 35.5" />
          <path className="bot-arm-right" d="M29 29.5 33 35.5" />
        </>
      }
    />

    {/* The desk. Drawn after the chassis so the hands go behind it rather than through it. */}
    <rect x={6.5} y={37} width={29} height={4.2} rx={1.4} />
    <path d="M13 39.1h.01" />
    <path d="M18 39.1h.01" />
    <path d="M23 39.1h.01" />
    <path d="M28 39.1h.01" />
  </>
);
