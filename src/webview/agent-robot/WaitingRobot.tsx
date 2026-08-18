import { RobotBubble } from './RobotBubble';
import { RobotHead } from './RobotHead';

// A tool call is out and there is nothing to do but watch the dots go round. The icon's own face,
// with its eyes rolled up — the dots in the bubble are what say it's waiting, and the face doesn't
// need to say it twice.
export const WaitingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye bot-eye-left" d="M13 17v2" />
        <path className="bot-eye bot-eye-right" d="M19 17v2" />
      </>
    }
    aside={
      <RobotBubble className="bot-bubble">
        <circle className="bot-dot" cx={24.7} cy={5.8} r={0.95} fill="currentColor" stroke="none" />
        <circle
          className="bot-dot bot-dot--2"
          cx={27}
          cy={5.8}
          r={0.95}
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="bot-dot bot-dot--3"
          cx={29.3}
          cy={5.8}
          r={0.95}
          fill="currentColor"
          stroke="none"
        />
      </RobotBubble>
    }
  />
);
