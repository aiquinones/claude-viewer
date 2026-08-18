import { RobotChassis } from './RobotChassis';

// The head cocked to one side and a hand up — the pose a dog makes at a word it half knows. This is
// the row you're holding up, so it's the one robot looking straight at you.
export const AskingRobot = () => (
  <>
    <RobotChassis
      face={
        <>
          <circle className="bot-eye" cx={16.5} cy={16} r={1.45} fill="currentColor" />
          <circle className="bot-eye" cx={25.5} cy={16} r={1.45} fill="currentColor" />
          {/* A small open mouth. Mid-question, not mid-sentence. */}
          <circle cx={21} cy={20.6} r={1.2} />
        </>
      }
      arms={
        <>
          <path d="M13 29.5 9.5 35" />
          {/* Raised markup rather than a rotated arm: a pose that never moves is better drawn than
              animated, and this one has to survive prefers-reduced-motion anyway. */}
          <path d="M29 29.5 33.5 25" />
        </>
      }
    />

    <text
      className="bot-ask"
      x={38}
      y={15}
      fontSize={14}
      fontWeight={700}
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
    >
      ?
    </text>
  </>
);
