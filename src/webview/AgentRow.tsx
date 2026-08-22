import { GitBranch } from 'lucide-react';
import { AgentActivity } from '../model/types';
import { cn } from '@/lib/utils';
import { ActivityBadge } from './ActivityBadge';
import { AgentContext } from './AgentContext';
import { AgentMenu } from './agent-menu/AgentMenu';
import { useAgentMenu } from './agent-menu/useAgentMenu';
import { AgentRowProps } from './agent-row-props';
import { RowColor, useRowColor } from './agent-color/useRowColor';
import { AgentRowFooter } from './AgentRowFooter';
import { AgentToolTag } from './AgentToolTag';
import { activityOf } from './agent-activity';
import { agentLabel, agentTooltip } from './agent-row-text';
import { displayFolder } from './display-path';
import { formatAge } from './format-age';

// One live agent: what it's doing, what it's called, where it's working, and how long ago it last
// wrote anything. Clicking goes to the agent itself — its Claude Code tab, or the terminal it runs
// in.
//
// Everything else is behind a right-click: the transcript, the session id, killing the process, and
// the row's colour. Those used to be two buttons that faded in at the corner, which is a lot of
// chrome on every row of a list you leave open — and a menu can name what it does, where an icon
// has to be hovered to say.
//
// The PR link and the issues still sit outside the row's button — a <button> can hold neither an
// <a> nor a <ul>. So the whole row is the hover and click surface and the button carries no handler
// of its own: a click on it bubbles up to the wrapper, which is also what a keyboard Enter does.
export const AgentRow = ({
  agent,
  now,
  workspaceRoot,
  onOpen,
  onOpenLog,
  onCopySessionId,
  onKill
}: AgentRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });
  const row: RowColor = useRowColor(agent.sessionId);
  const menu = useAgentMenu();

  return (
    <div
      onClick={() => onOpen(agent)}
      onContextMenu={menu.open}
      style={row.style}
      className={cn(
        'group relative flex cursor-pointer flex-col rounded-md hover:bg-accent',
        row.tintClass
      )}
    >
      <button
        type="button"
        title={agentTooltip(agent)}
        className="flex w-full min-w-0 flex-col gap-1.5 rounded-md px-3 py-2 text-left cursor-pointer"
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          <ActivityBadge activity={activity} tail={agent.tail} />
          <span
            className={cn(
              'truncate text-sm font-medium',
              activity === 'idle' && 'text-muted-foreground'
            )}
          >
            {agentLabel(agent)}
          </span>
          {/* The age earns its place next to the badge: most states here are inferred from it. */}
          <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
            {formatAge(now - agent.lastActivityAt)}
          </span>
        </span>

        <span className="flex w-full min-w-0 items-center gap-2 pl-3.5">
          <AgentToolTag tool={agent.tool} />
          <span className="mono truncate text-xs text-muted-foreground">
            {displayFolder({ path: agent.cwd, workspaceRoot })}
          </span>
          {/* Only Copilot records the branch. It's the thing you want to know about an agent
              working somewhere else, so it goes on the row when it's there. */}
          {agent.branch && (
            <span className="mono flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <GitBranch className="size-3 shrink-0" />
              {agent.branch}
            </span>
          )}
          {/* The tool only, never its input — that's the agent's own work, and this panel gets
              screenshotted. The name is what tells a long build from a permission prompt. */}
          {agent.pendingTool && activity !== 'idle' && (
            <span className="mono ml-auto shrink-0 text-xs text-activity-blocked">
              {agent.pendingTool}
            </span>
          )}
        </span>
      </button>

      {/* Outside the button, like everything else that isn't plain text: its card holds a CTA, and
          a `<button>` can't hold a `<button>`. Indented to the footer's left edge so the row has one
          text column rather than two. */}
      <AgentContext agent={agent} className="px-3 pb-2 pl-6" />

      <AgentRowFooter agent={agent} />

      {menu.anchor && (
        <AgentMenu
          agent={agent}
          anchor={menu.anchor}
          onClose={menu.close}
          onOpenLog={() => onOpenLog(agent)}
          onCopySessionId={() => onCopySessionId(agent)}
          onKill={() => onKill(agent)}
        />
      )}
    </div>
  );
};
