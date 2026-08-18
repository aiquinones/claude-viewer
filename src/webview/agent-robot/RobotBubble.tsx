import { ReactNode } from 'react';

interface RobotBubbleProps {
  className: string;
  children: ReactNode;
}

// The thought bubble beside the head, for the two moods that have something to say. No tail: it
// reads as a bubble at row size anyway, and a tail is three more strokes to lose.
//
// Its bottom edge sits at y=9.9 against a head that starts at y=12 — so it never overlaps the face, and
// the head stays in exactly the same place in every mood.
export const RobotBubble = ({ className, children }: RobotBubbleProps) => (
  <g className={className}>
    <ellipse cx={27} cy={5.8} rx={4.8} ry={4.1} />
    {children}
  </g>
);
