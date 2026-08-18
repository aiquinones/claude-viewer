import { RobotHead } from './RobotHead';

// Heads down: the eyes narrow to a focused slant and scan the line they're writing, while the head
// bobs at typing speed. The one row on the surface where something is actually happening, so it's
// the only mood that moves without stopping.
//
// Both eyes lean the same way. Slanted towards each other they fuse into a single V by the time the
// row is 8px tall — see the Working eyes story, which keeps that version around to look at.
export const WorkingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye" d="M12.4 16.6 13.6 19" />
        <path className="bot-eye" d="M18.4 16.6 19.6 19" />
      </>
    }
  />
);
