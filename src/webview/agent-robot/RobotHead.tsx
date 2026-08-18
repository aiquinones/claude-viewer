import { ReactNode } from 'react';

interface RobotHeadProps {
  // The eyes, and nothing else. A mood is a face — the head around it never changes, which is what
  // makes four states read as one robot.
  face: ReactNode;
  // What floats beside it: a bubble, or Zs. Drawn outside the head, top right.
  aside?: ReactNode;
}

// The extension's own icon at 1:1, centred in the 32×32 box `AgentRobot` sets. Same four strokes as
// `resources/activity-bar.svg` and `loading/Robot.tsx` — antenna, head, two ears — shifted by (4,4)
// so there is room above and to the right for a bubble.
//
// There is no body. The icon is a head, and a row full of these has to be recognisable as the icon
// from across the screen; arms and a torso are a different character wearing its face.
//
// Coordinates are shared with the keyframes in styles.css — the transform origins there are these
// numbers, so moving a part here means moving the origin that turns it.
export const RobotHead = ({ face, aside }: RobotHeadProps) => (
  <>
    <g className="bot-head">
      <path d="M16 12V8H12" />
      <rect x={8} y={12} width={16} height={12} rx={2} />
      {/* Ears. They meet the head's outline, which is why the robot paints in an opaque colour. */}
      <path d="M6 18h2" />
      <path d="M24 18h2" />
      {face}
    </g>
    {aside}
  </>
);
