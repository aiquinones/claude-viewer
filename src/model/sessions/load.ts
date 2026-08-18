import { AgentSession } from '../types';
import { loadClaudeSessions } from './claude/load';
import { loadCopilotSessions } from './copilot/load';

// Every agent running right now, whichever CLI is running it. Each tool has its own loader because
// each reads a different set of files; they meet here, in one list, because the question the surface
// answers — what is running, and where — spans both.
export const loadAgentSessions = async (): Promise<AgentSession[]> => {
  const [claude, copilot]: AgentSession[][] = await Promise.all([
    loadClaudeSessions(),
    loadCopilotSessions()
  ]);

  // Most recently active first — the agent that just did something is the one being looked for.
  // Sorted across both, so the list reads as one thing rather than two lists stacked.
  return [...claude, ...copilot].sort((left, right) => right.lastActivityAt - left.lastActivityAt);
};
