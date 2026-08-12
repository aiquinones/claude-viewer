import { AgentActivity, AgentSession } from '../model/types';
import { cn } from '@/lib/utils';
import { ActivityBadge } from './ActivityBadge';
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
// The issues sit outside the button: IssueList is a <ul>, which a <button> can't legally hold.
export const AgentRow = ({ agent, now, workspaceRoot, onOpen }: AgentRowProps) => {
  const activity: AgentActivity = activityOf({ agent, now });

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onOpen(agent)}
        title={`${agent.transcriptPath}\npid ${agent.pid}${agent.version ? ` · Claude Code ${agent.version}` : ''}`}
        className="flex w-full min-w-0 flex-col gap-1.5 rounded-md px-3 py-2 text-left cursor-pointer hover:bg-accent"
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          <ActivityBadge activity={activity} />
          <span
            className={cn(
              'truncate text-sm font-medium',
              activity === 'idle' && 'text-muted-foreground'
            )}
          >
            {label(agent)}
          </span>
          {/* The age earns its place next to the badge: every state here is inferred from it. */}
          <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
            {formatAge(now - agent.lastActivityAt)}
          </span>
        </span>

        <span className="flex w-full min-w-0 items-center gap-2 pl-3.5">
          <span className="mono shrink-0 text-xs text-muted-foreground">{agent.name}</span>
          <span className="mono truncate text-xs text-muted-foreground">
            {displayFolder({ path: agent.cwd, workspaceRoot })}
          </span>
          {/* The tool only, never its input — that's the agent's own work, and this panel gets
              screenshotted. The name is what tells a long build from a permission prompt. */}
          {agent.pendingTool && activity !== 'idle' && (
            <span className="mono ml-auto shrink-0 text-xs text-activity-blocked">
              {agent.pendingTool}
            </span>
          )}
        </span>
      </button>

      {agent.issues.length > 0 && (
        <div className="px-3 pb-2 pl-6">
          <IssueList issues={agent.issues} />
        </div>
      )}
    </div>
  );
};

// Claude Code names the session itself, and rewrites that name as the session goes on. Before it
// has, the last prompt says more than the session id ever would; failing both, the folder does.
const label = (agent: AgentSession): string =>
  agent.title ?? agent.lastPrompt ?? fileName(agent.cwd);
