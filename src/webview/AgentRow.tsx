import { GitBranch, GitPullRequest } from 'lucide-react';
import { AGENT_TOOL_LABEL, AgentActivity, AgentSession } from '../model/types';
import { cn } from '@/lib/utils';
import { ActivityBadge } from './ActivityBadge';
import { AgentToolTag } from './AgentToolTag';
import { IssueList } from './IssueList';
import { activityOf } from './agent-activity';
import { displayFolder, fileName } from './display-path';
import { formatAge } from './format-age';

interface AgentRowProps {
  agent: AgentSession;
  // Passed in rather than read here, so every row on the surface ages against the same instant.
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
}

// One live agent: what it's doing, what it's called, where it's working, and how long ago it last
// wrote anything. Clicking opens its transcript.
//
// The PR link and the issues sit outside the button — a <button> can't legally hold an <a> or a
// <ul>. So the whole row is the hover and click surface and the button carries no handler of its
// own: a click on it bubbles up to the wrapper, which is also what a keyboard Enter does. The one
// thing that has to opt out is the link, or following it would open the transcript as well.
export const AgentRow = ({ agent, now, workspaceRoot, onOpen }: AgentRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });

  return (
    <div
      onClick={() => onOpen(agent)}
      className="flex cursor-pointer flex-col rounded-md hover:bg-accent"
    >
      <button
        type="button"
        title={tooltip(agent)}
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
            {label(agent)}
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

      {(agent.pullRequest || agent.issues.length > 0) && (
        <div className="flex flex-col gap-1 px-3 pb-2 pl-6">
          {agent.pullRequest && (
            <a
              href={agent.pullRequest.url}
              title={agent.pullRequest.url}
              target="_blank"
              rel="noreferrer"
              // The row's click is on the wrapper above this, so the PR has to stop the bubble or
              // it opens the transcript behind the browser it just opened.
              onClick={(event) => event.stopPropagation()}
              className="mono flex w-fit items-center gap-1.5 text-xs text-link hover:underline"
            >
              <GitPullRequest className="size-3.5 shrink-0" />
              PR #{agent.pullRequest.number}
            </a>
          )}
          {agent.issues.length > 0 && <IssueList issues={agent.issues} />}
        </div>
      )}
    </div>
  );
};

// Both CLIs name the session themselves. Before one has, the last prompt says more than the session
// id ever would; failing both, the folder does.
const label = (agent: AgentSession): string =>
  agent.title ?? agent.lastPrompt ?? fileName(agent.cwd);

// The identifying facts, none of which earn a place on the row itself. The repository is here
// rather than beside the branch: two agents in one repo is the normal case, so it says nothing the
// grouping hasn't already said.
const tooltip = (agent: AgentSession): string =>
  [
    agent.transcriptPath,
    `pid ${agent.pid}`,
    agent.version ? `${AGENT_TOOL_LABEL[agent.tool]} ${agent.version}` : AGENT_TOOL_LABEL[agent.tool],
    agent.repository
  ]
    .filter((part): part is string => Boolean(part))
    .join('\n');
