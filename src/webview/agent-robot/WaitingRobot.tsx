import { OpenEyes } from './Eyes';
import { RobotHead } from './RobotHead';

// A tool call is out. The robot is the icon doing what the icon does — blinking, glancing to the
// sides, one gesture a tick — and the three dots beside it are the whole of what makes it waiting.
//
// It carries no pose of its own on purpose. Waiting is the state you should be able to skim past,
// and a robot acting one out draws the eye that asking needs.
export const WaitingRobot = () => (
  <RobotHead
    face={<OpenEyes />}
    aside={
      <>
        <Dot className="bot-dot" cx={25.6} />
        <Dot className="bot-dot bot-dot--2" cx={28} />
        <Dot className="bot-dot bot-dot--3" cx={30.4} />
      </>
    }
  />
);

interface DotProps {
  className: string;
  cx: number;
}

const Dot = ({ className, cx }: DotProps) => (
  <circle className={className} cx={cx} cy={10} r={1.1} fill="currentColor" stroke="none" />
);
