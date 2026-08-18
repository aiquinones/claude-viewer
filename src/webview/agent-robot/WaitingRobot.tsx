import { RobotChassis } from './RobotChassis';

// Stood still with a hand drumming and its eyes rolled up: something else has the turn. The three
// dots are the wait itself — they cycle whether or not anything is coming back.
export const WaitingRobot = () => (
  <>
    <RobotChassis
      face={
        <>
          <circle className="bot-eye" cx={16.5} cy={16} r={1.15} fill="currentColor" />
          <circle className="bot-eye" cx={25.5} cy={16} r={1.15} fill="currentColor" />
          <path d="M18.5 21h5" />
        </>
      }
      arms={
        <>
          <path d="M13 29.5 9.5 35" />
          <path className="bot-arm-right" d="M29 29.5 32.5 34.5" />
        </>
      }
    />

    <circle className="bot-dot" cx={35.5} cy={7} r={1.2} fill="currentColor" stroke="none" />
    <circle className="bot-dot bot-dot--2" cx={38.8} cy={7} r={1.2} fill="currentColor" stroke="none" />
    <circle className="bot-dot bot-dot--3" cx={42.1} cy={7} r={1.2} fill="currentColor" stroke="none" />
  </>
);
