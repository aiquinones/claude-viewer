import { AgentSession } from '../model/types';

interface GroupAgentsArgs {
  agents: AgentSession[];
  workspaceRoot: string | undefined;
}

export interface AgentGroups {
  here: AgentSession[];
  elsewhere: AgentSession[];
}

// Split by where each agent is working. A worktree counts as this workspace — it sits under
// `<root>/.claude/worktrees/` — which is the case worth getting right: a worktree session gets its
// own transcript directory and would otherwise read as somewhere else entirely.
export const groupByWorkspace = ({ agents, workspaceRoot }: GroupAgentsArgs): AgentGroups => {
  if (!workspaceRoot) return { here: [], elsewhere: agents };

  const here: AgentSession[] = agents.filter(
    (agent) => agent.cwd === workspaceRoot || agent.cwd.startsWith(`${workspaceRoot}/`)
  );

  return { here, elsewhere: agents.filter((agent) => !here.includes(agent)) };
};
