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

const BODIES: Record<RobotMood, FunctionComponent> = {
  working: WorkingRobot,
  waiting: WaitingRobot,
  asking: AskingRobot,
  sleeping: SleepingRobot
};

// One agent, drawn. Not the loading robot: that one is the extension's icon inline and belongs to
// `loading/`. These have a torso, arms and somewhere to be, because a row is big enough to hold a
// pose and a pose is what says what the agent is up to.
//
// Every animation is CSS, keyed off the mood class. The surface re-renders every second to re-age
// its rows and none of this should ride that.
export const AgentRobot = ({
  mood,
  tickMs = DEFAULT_TICK_MS,
  className = 'size-11'
}: AgentRobotProps) => {
  const Body = BODIES[mood];

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`agent-robot agent-robot--${mood} ${className}`}
      style={{ '--robot-tick': `${tickMs}ms` } as CSSProperties}
    >
      <Body />
    </svg>
  );
};
