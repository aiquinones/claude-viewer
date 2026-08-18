import { CSSProperties, FunctionComponent } from 'react';
import { AskingRobot } from './AskingRobot';
import { RobotMood } from './moods';
import { SleepingRobot } from './SleepingRobot';
import { WaitingRobot } from './WaitingRobot';
import { WorkingRobot } from './WorkingRobot';

interface AgentRobotProps {
  mood: RobotMood;
  // The beat every mood is timed against — a keystroke, a breath, a blink of the dots. One number,
  // so a slow robot and a fast one are the same component.
  tickMs?: number;
  className?: string;
}

// Slow enough to read as alive rather than agitated. Nine of these on screen at once is the case
// that sets it.
const DEFAULT_TICK_MS: number = 900;

const ROBOTS: Record<RobotMood, FunctionComponent> = {
  working: WorkingRobot,
  waiting: WaitingRobot,
  asking: AskingRobot,
  sleeping: SleepingRobot
};

// One agent, drawn. The same head as the extension's icon — `RobotHead` carries those four strokes
// at 1:1 — with the eyes swapped per mood and at most one thing floating beside it. A card of these
// has to be recognisable as the icon from across the room, which rules out giving it a body.
//
// Every animation is CSS, keyed off the mood class. The surface re-renders every second to re-age
// its rows and none of this should ride that.
export const AgentRobot = ({
  mood,
  tickMs = DEFAULT_TICK_MS,
  className = 'size-11'
}: AgentRobotProps) => {
  const Robot = ROBOTS[mood];

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`agent-robot agent-robot--${mood} ${className}`}
      style={{ '--robot-tick': `${tickMs}ms` } as CSSProperties}
    >
      <Robot />
    </svg>
  );
};
