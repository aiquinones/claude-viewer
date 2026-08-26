import { useState } from 'react';
import { GitPullRequest } from 'lucide-react';
import { AgentPullRequest, AgentSession, Subagent } from '../model/types';
import { SubagentList } from './agent-subagents/SubagentList';
import { SubagentToggle } from './agent-subagents/SubagentToggle';

interface AgentRowFooterProps {
  agent: AgentSession;
}

// What hangs under a dense row: the sub-agents it has out, and the PR this session opened. Outside
// the row's button because a `<button>` can hold neither an `<a>` nor another button — which is the
// whole reason this is its own line rather than two more things on the row.
//
// The issues used to be here too. They're icons beside the age now: a sentence about a missing
// event log was three lines of red under a row you opened to read its title.
//
// The open state lives here rather than in the toggle: the list is a sibling of the line the toggle
// is on, since an expanded list wants the row's full width and the PR link wants to stay beside the
// toggle. It survives the poll — `AgentList` keys rows by session id, so the row isn't remounted.
//
// Robots mode doesn't use it — a PR is a squircle there.
export const AgentRowFooter = ({ agent }: AgentRowFooterProps) => {
  const [open, setOpen] = useState(false);
  const subagents: Subagent[] = agent.subagents ?? [];

  if (subagents.length === 0 && !agent.pullRequest) return null;

  return (
    <div className="flex min-w-0 flex-col gap-2 px-3 pb-2 pl-6">
      <div className="flex w-full min-w-0 items-center gap-3">
        {subagents.length > 0 && (
          <SubagentToggle
            count={subagents.length}
            open={open}
            onToggle={() => setOpen((wasOpen) => !wasOpen)}
          />
        )}
        {agent.pullRequest && <PullRequestLink pullRequest={agent.pullRequest} />}
      </div>
      {open && subagents.length > 0 && <SubagentList subagents={subagents} />}
    </div>
  );
};

interface PullRequestLinkProps {
  pullRequest: AgentPullRequest;
}

// No click handler of its own: the row keeps out of the way with `isLinkClick` instead. A
// `stopPropagation()` here would also stop the event reaching the listener that opens the link —
// see `link-click.ts`.
const PullRequestLink = ({ pullRequest }: PullRequestLinkProps) => (
  <a
    href={pullRequest.url}
    title={pullRequest.url}
    target="_blank"
    rel="noreferrer"
    className="mono flex w-fit shrink-0 items-center gap-1.5 text-xs text-link hover:underline"
  >
    <GitPullRequest className="size-3.5 shrink-0" />
    PR #{pullRequest.number}
  </a>
);
