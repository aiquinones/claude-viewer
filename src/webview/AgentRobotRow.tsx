import { GitBranch } from 'lucide-react';
import { AgentActivity, AgentSession } from '../model/types';
import { cn } from '@/lib/utils';
import { AgentColorPicker } from './agent-color/AgentColorPicker';
import { RowColor, useRowColor } from './agent-color/useRowColor';
import { AgentRobot } from './agent-robot/AgentRobot';
import { ROBOT_MOOD_LABEL, RobotMood, robotMood } from './agent-robot/moods';
import { AgentRowFooter } from './AgentRowFooter';
import { activityOf } from './agent-activity';
import { agentLabel, agentTooltip } from './agent-row-text';
import { displayFolder } from './display-path';
import { formatAge } from './format-age';

interface AgentRobotRowProps {
  agent: AgentSession;
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
}

// The same session as `AgentRow`, acted out instead of labelled. The robot carries the state, so
// the badge, the tool tag and the pending tool come off the row — what's left is who it is, where
// it's working and how long it's been.
//
// The pending tool still decides the pose: it's what separates an agent waiting on a command from
// one waiting on you.
export const AgentRobotRow = ({ agent, now, workspaceRoot, onOpen }: AgentRobotRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });
  const mood: RobotMood = robotMood({ activity, pendingTool: agent.pendingTool });
  const row: RowColor = useRowColor(agent.sessionId);

  return (
    <div
      onClick={() => onOpen(agent)}
      style={row.style}
      className={cn(
        'group relative flex cursor-pointer flex-col rounded-md hover:bg-accent',
        row.tintClass
      )}
    >
      <button
        type="button"
        title={agentTooltip(agent)}
        className="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2 pr-9 text-left cursor-pointer"
      >
        <AgentRobot mood={mood} className="size-11 shrink-0" />

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex w-full min-w-0 items-center gap-2">
            <span
              className={cn(
                'truncate text-sm font-medium',
                mood === 'sleeping' && 'text-muted-foreground'
              )}
            >
              {agentLabel(agent)}
            </span>
            <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
              {formatAge(now - agent.lastActivityAt)}
            </span>
          </span>

          <span className="flex w-full min-w-0 items-center gap-2 text-xs text-muted-foreground">
            {/* What the robot is doing, in words. The picture is the state; this is the caption. */}
            <span className="shrink-0">{ROBOT_MOOD_LABEL[mood]}</span>
            <span className="mono truncate">
              {displayFolder({ path: agent.cwd, workspaceRoot })}
            </span>
            {agent.branch && (
              <span className="mono flex shrink-0 items-center gap-1">
                <GitBranch className="size-3 shrink-0" />
                {agent.branch}
              </span>
            )}
          </span>
        </span>
      </button>

      <div className="absolute right-2 top-3">
        <AgentColorPicker color={row.color} onPick={row.pick} />
      </div>

      <AgentRowFooter agent={agent} />
    </div>
  );
};
