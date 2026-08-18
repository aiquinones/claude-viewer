import { AgentActivity } from '../../model/types';

// How a robot is drawn. Four of them over three agent states, because the interesting split is
// inside `blocked`: a tool call is out and nothing has been written since, which is either an agent
// waiting on a command or an agent that stopped to ask you something.
//
// Deliberately not annotated: a type here would erase the literals `RobotMood` derives from.
export const ROBOT_MOODS = ['working', 'waiting', 'asking', 'sleeping'] as const;

export type RobotMood = (typeof ROBOT_MOODS)[number];

// The tool Claude stops on when the answer it needs is yours. Every other pending tool is the agent
// waiting on a machine.
const ASK_TOOL: string = 'AskUserQuestion';

interface RobotMoodArgs {
  activity: AgentActivity;
  pendingTool: string | undefined;
}

// The only place the blocked split is written down. It stays out of model/sessions/activity.ts on
// purpose: this is a drawing decision, not a fourth agent state — the badge still says Waiting for
// both, and the tooltip still says which reading it is.
export const robotMood = ({ activity, pendingTool }: RobotMoodArgs): RobotMood => {
  if (activity === 'running') return 'working';
  if (activity === 'idle') return 'sleeping';
  return pendingTool === ASK_TOOL ? 'asking' : 'waiting';
};

// What each robot is doing, for the label a row prints under the badge.
export const ROBOT_MOOD_LABEL: Record<RobotMood, string> = {
  working: 'heads down',
  waiting: 'waiting on a tool',
  asking: 'asking you something',
  sleeping: 'asleep'
};
