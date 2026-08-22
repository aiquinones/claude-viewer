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

  // Newest session first, and sorted across both so the list reads as one thing rather than two
  // stacked. Ordering by activity instead put whichever agent just wrote a line on top, which
  // reshuffles the list on every poll — the row you're reading moves out from under you. A start
  // time doesn't change, so a row keeps its place for as long as the session is alive.
  return [...claude, ...copilot].sort((left, right) => startRank(right) - startRank(left));
};

// When the session began. Claude's session file records it and Copilot's `workspace.yaml` does too,
// but either can be missing — and a session that sorted as epoch zero would sit at the bottom
// forever, which is worse than the small amount of movement its last write brings.
const startRank = (agent: AgentSession): number => agent.startedAt || agent.lastActivityAt;
