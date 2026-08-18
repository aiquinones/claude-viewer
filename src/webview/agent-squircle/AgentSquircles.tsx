import { GitPullRequest } from 'lucide-react';
import { AgentSession } from '../../model/types';
import { AgentSquircle } from './AgentSquircle';

interface AgentSquirclesProps {
  agent: AgentSession;
}

// What this agent has to show for itself, down the right edge of its row. Each tile appears only
// when there is something to point at, so a session that has produced nothing renders nothing —
// which is why the whole column is absent rather than empty.
//
// The PR is the only one today. The next ones go here beside it, and the column keeps its shape.
export const AgentSquircles = ({ agent }: AgentSquirclesProps) => {
  if (!agent.pullRequest) return null;

  return (
    <div className="flex flex-col gap-2">
      <AgentSquircle
        icon={GitPullRequest}
        label="Pull request"
        href={agent.pullRequest.url}
        title={`PR #${agent.pullRequest.number}`}
      />
    </div>
  );
};
