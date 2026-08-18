import { RobotBubble } from './RobotBubble';
import { RobotHead } from './RobotHead';

// A tool call is out and there is nothing to do but watch the dots go round. One eye still a tick
// and the other gone round — the normal face, half shut, which is where it should be: this is the
// state on its way to sleeping if nothing comes back.
export const WaitingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye" d="M13 17v2" />
        <circle className="bot-eye" cx={19} cy={18} r={1.1} fill="currentColor" />
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
