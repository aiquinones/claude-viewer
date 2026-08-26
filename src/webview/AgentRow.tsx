import { GitBranch } from 'lucide-react';
import { AgentActivity } from '../model/types';
import { cn } from '@/lib/utils';
import { ActivityBadge } from './ActivityBadge';
import { AgentContext } from './AgentContext';
import { AgentFlags } from './AgentFlags';
import { AgentMenu } from './agent-menu/AgentMenu';
import { useAgentMenu } from './agent-menu/useAgentMenu';
import { AgentRowProps } from './agent-row-props';
import { RowColor, useRowColor } from './agent-color/useRowColor';
import { AgentRowFooter } from './AgentRowFooter';
import { AgentStage } from './AgentStage';
import { AgentToolIcon } from './agent-icon/AgentToolIcon';
import { activityOf } from './agent-activity';
import { agentLabel } from './agent-row-text';
import { displayFolder } from './display-path';
import { formatAge } from './format-age';
import { isLinkClick } from './link-click';

// One live agent: what it's doing, what it's called, where it's working, and which part of its work
// is open. Clicking goes to the agent itself — its Claude Code tab, or the terminal it runs in.
//
// No age on most rows. A counter ticking on every row of a list you leave open is motion that never
// resolves into anything you'd act on, and the two states worth reading — Working and Idle — say
// what they are outright. Waiting is the exception, and it keeps its age beside the badge.
//
// Everything else is behind a right-click: the transcript, the session id, killing the process, and
// the row's colour. Those used to be two buttons that faded in at the corner, which is a lot of
// chrome on every row of a list you leave open — and a menu can name what it does, where an icon
// has to be hovered to say.
//
// The PR link and the issues still sit outside the row's button — a <button> can hold neither an
// <a> nor a <ul>. So the whole row is the hover and click surface and the button carries no handler
// of its own: a click on it bubbles up to the wrapper, which is also what a keyboard Enter does.
//
// Which means the wrapper has to let a link through — `isLinkClick` — rather than the link stopping
// its own bubble, or the PR opens the transcript instead of the browser.
export const AgentRow = ({
  agent,
  now,
  workspaceRoot,
  onOpen,
  onAnalyze,
  onOpenLog,
  onCopySessionId,
  onKill
}: AgentRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });
  const row: RowColor = useRowColor(agent.sessionId);
  const menu = useAgentMenu();

  return (
    <div
      onClick={(event) => {
        if (isLinkClick(event)) return;
        onOpen(agent);
      }}
      onContextMenu={menu.open}
      style={row.style}
      className={cn(
        'group relative flex cursor-pointer flex-col rounded-md hover:bg-accent',
        row.tintClass
      )}
    >
      <button
        type="button"
        className="flex w-full min-w-0 flex-col gap-1.5 rounded-md px-3 py-2 text-left cursor-pointer"
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          <ActivityBadge activity={activity} tail={agent.tail} />
          {/* The age, and only on this state. Waiting is the one badge that *is* an age — how long
              a tool call has been out is the difference between a slow build and a prompt nobody
              answered — so it qualifies the word it sits beside. Muted rather than the badge's
              colour, since a Copilot row reads `blocked` off a permission event and the clock had
              no part in it.

              Given a floor width, because it's the one thing here that changes size on its own:
              every form `formatAge` prints is three characters or fewer, so a fixed 2rem holds all
              of them and nothing to the right of it slides while you're reading. */}
          {activity === 'blocked' && (
            <span className="mono min-w-8 shrink-0 text-xs text-muted-foreground">
              {formatAge(now - agent.lastActivityAt)}
            </span>
          )}
          {/* Anything wrong with the row, as icons — this end rather than out by the stage, since
              they're about the row rather than about its work. They sit inside the button, unlike
              the PR link: a tooltip is spans, and a `<button>` can hold those. */}
          <AgentFlags agent={agent} />
          <span
            className={cn(
              'truncate text-sm font-medium',
              activity === 'idle' && 'text-muted-foreground'
            )}
          >
            {agentLabel(agent)}
          </span>
          {/* Which part of its work the agent is in, at the far end of the line. The wrapper is
              what carries the `ml-auto`, not `AgentStage` — a margin passed into a component that
              sets its own layout classes is the coin flip the position gotchas are about, and the
              stage's own root is a tooltip's `relative inline-flex`. */}
          <span className="ml-auto flex min-w-0 shrink-0 items-center">
            <AgentStage agent={agent} activity={activity} />
          </span>
        </span>

        <span className="flex w-full min-w-0 items-center gap-2 pl-3.5">
          <AgentToolIcon tool={agent.tool} />
          {/* Only where it says something the panel hasn't. An agent sitting in the open folder
              would print that folder's name back at you — the header already did. A worktree is
              under the same root and still prints, since which worktree is the whole question when
              two agents share a repo. */}
          {agent.cwd !== workspaceRoot && (
            <span className="mono truncate text-xs text-muted-foreground">
              {displayFolder({ path: agent.cwd, workspaceRoot })}
            </span>
          )}
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
      <AgentContext context={agent.context} className="px-3 pb-2 pl-6" />

      <AgentRowFooter agent={agent} />

      {menu.anchor && (
        <AgentMenu
          agent={agent}
          anchor={menu.anchor}
          onClose={menu.close}
          onAnalyze={() => onAnalyze(agent)}
          onOpenLog={() => onOpenLog(agent)}
          onCopySessionId={() => onCopySessionId(agent)}
          onKill={() => onKill(agent)}
        />
      )}
    </div>
  );
};
