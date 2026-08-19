import { AgentActivity, AgentSession } from '../model/types';
import { cn } from '@/lib/utils';
import { AgentColorPicker } from './agent-color/AgentColorPicker';
import { AgentContext } from './AgentContext';
import { AgentLogButton } from './AgentLogButton';
import { RowColor, useRowColor } from './agent-color/useRowColor';
import { AgentRobot } from './agent-robot/AgentRobot';
import { RobotMood, robotMood } from './agent-robot/moods';
import { AgentSquircles } from './agent-squircle/AgentSquircles';
import { activityOf } from './agent-activity';
import { agentLabel, agentTooltip } from './agent-row-text';

interface AgentRobotRowProps {
  agent: AgentSession;
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
  onOpenLog: (agent: AgentSession) => void;
}

// The same session as `AgentRow`, acted out instead of listed. The robot carries the state, so
// everything the dense row spells out — the badge, the tool, the age, the folder, the branch —
// comes off. What's left is a picture and a name, which is what you can read from across a room.
//
// The pending tool still decides the pose: it's what separates an agent waiting on a command from
// one waiting on you.
//
// `workspaceRoot` is unused here and stays in the props: `AgentList` picks between this and
// `AgentRow` by mode and hands both the same four things.
export const AgentRobotRow = ({ agent, now, onOpen, onOpenLog }: AgentRobotRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });
  const mood: RobotMood = robotMood({ activity, pendingTool: agent.pendingTool });
  const row: RowColor = useRowColor(agent.sessionId);

  return (
    <div
      onClick={() => onOpen(agent)}
      style={row.style}
      className={cn(
        'group relative cursor-pointer rounded-md hover:bg-accent',
        row.tintClass
      )}
    >
      <button
        type="button"
        title={agentTooltip(agent)}
        // The tall one. The robot needs room to be the thing you see first, and the padding is
        // wider on the right so a name never runs under the squircles.
        //
        // `gap-1` rather than something roomier: the robot's view box carries 8 units of margin
        // under the head — the room the Zs and the bubbles need above it, kept on both sides so the
        // head stays centred — which is already most of the space between the two.
        className="flex h-40 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md px-16 py-5 text-center"
      >
        <AgentRobot mood={mood} className="size-24 shrink-0" />

        {/* Two lines, then it clips. A conversation name is a sentence often enough that one line
            cuts most of them off, and a row that grows with its title breaks the grid. */}
        <span
          className={cn(
            'line-clamp-2 max-w-full text-sm font-medium leading-snug',
            mood === 'sleeping' && 'text-muted-foreground'
          )}
        >
          {agentLabel(agent)}
        </span>
      </button>

      {/* Under the name, at the foot of the card. The robot row spells nothing out in words, which
          is exactly what a bar is for.

          The wrapper does the positioning rather than a class on `AgentContext`: that one is already
          `relative`, and passing `absolute` alongside it leaves which wins to the order Tailwind
          happens to emit the two rules in. `pointer-events-none` lets the row's click through the
          full-width strip, and the bar itself takes them back. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center">
        <AgentContext agent={agent} className="pointer-events-auto w-28" />
      </div>

      {/* All three sit outside the button: a `<button>` can hold neither an `<a>` nor the picker's
          popup nor another button. Their clicks stop bubbling, so none of them focuses the agent. */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <AgentSquircles agent={agent} />
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1">
        <AgentLogButton onOpen={() => onOpenLog(agent)} />
        <AgentColorPicker color={row.color} onPick={row.pick} />
      </div>
    </div>
  );
};
