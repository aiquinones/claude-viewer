import { AgentSession, AgentTool } from '../types';

interface FindAgentArgs {
  agents: AgentSession[];
  sessionId: string;
  tool: AgentTool;
}

// The live agent writing to a session, if one still is. Both sides ask this and neither can ask the
// other: the host decides whether a session is worth re-reading, the panel decides whether to draw
// an activity badge. Pure, like `activity.ts` and for the same reason.
export const findAgent = ({ agents, sessionId, tool }: FindAgentArgs): AgentSession | undefined =>
  agents.find((agent) => agent.sessionId === sessionId && agent.tool === tool);
