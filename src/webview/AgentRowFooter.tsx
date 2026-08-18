import { GitPullRequest } from 'lucide-react';
import { AgentSession } from '../model/types';
import { IssueList } from './IssueList';

interface AgentRowFooterProps {
  agent: AgentSession;
}

// What hangs under a row in either mode: the PR this session opened, and anything wrong with it.
// Outside the row's button because a `<button>` can hold neither an `<a>` nor a `<ul>`.
export const AgentRowFooter = ({ agent }: AgentRowFooterProps) => {
  if (!agent.pullRequest && agent.issues.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 px-3 pb-2 pl-6">
      {agent.pullRequest && (
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
      )}
      {agent.issues.length > 0 && <IssueList issues={agent.issues} />}
    </div>
  );
};
