import { RobotBubble } from './RobotBubble';
import { RobotHead } from './RobotHead';

// The head cocked to one side and a question mark up beside it — the pose a dog makes at a word it
// half knows. This is the row you're holding up, so it's the one robot with its eyes wide open.
export const AskingRobot = () => (
  <RobotHead
    face={
      <>
        {/* `stroke="none"`, or the root's 2-unit stroke is added around the radius and the eye
            comes out 4.6 across against an icon whose eyes are 2. */}
        <circle className="bot-eye" cx={13} cy={18} r={1.4} fill="currentColor" stroke="none" />
        <circle className="bot-eye" cx={19} cy={18} r={1.4} fill="currentColor" stroke="none" />
      </>
    }
    aside={
      <RobotBubble className="bot-bubble bot-ask">
        <text
          x={27}
          y={8.6}
          fontSize={8}
          fontWeight={700}
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
        >
          ?
        </text>
      </RobotBubble>
    }
  />
);
