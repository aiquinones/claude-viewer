import { ReactNode } from 'react';

interface RobotChassisProps {
  // What the robot is doing with its face and its hands — the two places a mood lives. Everything
  // else is the same robot, which is the point: four states, one character.
  face: ReactNode;
  arms: ReactNode;
}

// The body every mood is drawn on, in the 44×44 box `AgentRobot` sets. Coordinates are shared with
// the keyframes in styles.css — the transform origins there are these numbers, so moving a part
// here means moving the origin that spins it.
//
// The head is its own group because two moods turn it: sleeping lets it hang, asking cocks it to
// the side.
export const RobotChassis = ({ face, arms }: RobotChassisProps) => (
  <g className="bot-chassis">
    <g className="bot-head">
      <path d="M21 9V5.6" />
      <circle className="bot-antenna" cx={21} cy={4} r={1.7} />
      <rect x={10} y={9} width={22} height={15} rx={5} />
      {/* Ears. They meet the head's outline, which is why the robot paints in an opaque colour. */}
      <path d="M7 16h3" />
      <path d="M32 16h3" />
      {face}
    </g>
    <path d="M21 24v2" />
    <rect className="bot-torso" x={13} y={26} width={16} height={11} rx={3} />
    {arms}
  </g>
);
