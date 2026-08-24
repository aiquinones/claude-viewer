import { GitPullRequest } from 'lucide-react';
import { AgentSession } from '../model/types';

interface AgentRowFooterProps {
  agent: AgentSession;
}

// What hangs under a dense row: the PR this session opened. Outside the row's button because a
// `<button>` can't hold an `<a>` — which is the whole reason this is its own line rather than one
// more thing on the row.
//
// The issues used to be here too. They're icons beside the age now: a sentence about a missing
// event log was three lines of red under a row you opened to read its title.
//
// Robots mode doesn't use it — a PR is a squircle there.
export const AgentRowFooter = ({ agent }: AgentRowFooterProps) => {
  if (!agent.pullRequest) return null;

  return (
    <div className="flex flex-col gap-1 px-3 pb-2 pl-6">
      <a
        href={agent.pullRequest.url}
        title={agent.pullRequest.url}
        target="_blank"
        rel="noreferrer"
        // The row's click is on the wrapper above this, so the PR has to stop the bubble or it
        // opens the transcript behind the browser it just opened.
        onClick={(event) => event.stopPropagation()}
        className="mono flex w-fit items-center gap-1.5 text-xs text-link hover:underline"
      >
        <GitPullRequest className="size-3.5 shrink-0" />
        PR #{agent.pullRequest.number}
      </a>
    </div>
  );
};
