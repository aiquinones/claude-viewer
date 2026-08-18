import { OpenEyes, ShutEyes } from './Eyes';
import { RobotHead } from './RobotHead';

// A tool call is out, and the wait is long enough that the robot nods off in it. It shuts its eyes,
// breathes twice — up, down, up, down — and on the way down the second time it hits the bottom,
// catches itself, snaps its eyes open and shakes it off. Then it does it again, because the tool
// still hasn't come back.
//
// Both pairs of eyes are drawn and cross-faded rather than morphed: a pill is a line and a shut eye
// is a cubic, and no amount of `d` interpolation turns one into the other. The shut pair starts at
// `opacity: 0` in the stylesheet, so with animations off this is just the icon's face.
export const WaitingRobot = () => (
  <RobotHead
    face={
      <>
        <OpenEyes className="bot-eye-awake" />
        <ShutEyes className="bot-eye-dozing" />
      </>
    }
    aside={
      <>
        {/* Three bare dots rather than a bubble. The ? next door doesn't have one either, and at
            row size the ellipse was most of what you saw. */}
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
