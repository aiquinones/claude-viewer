import { OpenEyes } from './Eyes';
import { RobotHead } from './RobotHead';

// The icon's own face, doing the one thing the icon doesn't. It sits level and blinks like any
// other robot; then, where the icon would glance to the sides, this one tilts its head — and only
// once it's over does the question mark arrive, dropping in from above as it fades up. The ? leaves
// as the head comes back level, so the two of them are one gesture with a beginning and an end.
//
// The order is the point. A ? that is simply always up says the row is blocked. A ? that arrives
// after the head has gone over says the robot thought about it first.
//
// No bubble around it. Nothing beside any of these heads has one — at row size the ellipse was most
// of what you saw.
export const AskingRobot = () => (
  <RobotHead
    face={<OpenEyes />}
    aside={
      <text
        className="bot-ask"
        x={28}
        y={12}
        fontSize={11}
        fontWeight={700}
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >
        ?
      </text>
    }
  />
);
