import { AgentSession } from '../types';
import { loadClaudeSessions } from './claude/load';
import { loadCodexSessions } from './codex/load';
import { loadCopilotSessions } from './copilot/load';
import { CopilotPrCache } from './copilot/pull-request';

// Every agent running right now, whichever CLI is running it. Each tool has its own loader because
// each reads a different set of files; they meet here, in one list, because the question the surface
// answers — what is running, and where — spans all of them.
//
// The one thing held between passes is Copilot's: the PR a session opened is named once, anywhere in
// a log that reaches megabytes, so it's found by a full read the first time and by the appended
// bytes after. Claude repeats its own PR line near the end of the file, so its loader needs nothing.
export const loadAgentSessions = async (
  copilotPullRequests: CopilotPrCache
): Promise<AgentSession[]> => {
  const [claude, copilot, codex]: AgentSession[][] = await Promise.all([
    loadClaudeSessions(),
    loadCopilotSessions(copilotPullRequests),
    loadCodexSessions()
  ]);

  // Newest session first, and sorted across all three so the list reads as one thing rather than
  // three stacked. Ordering by activity instead put whichever agent just wrote a line on top, which
  // reshuffles the list on every poll — the row you're reading moves out from under you. A start
  // time doesn't change, so a row keeps its place for as long as the session is alive.
  return [...claude, ...copilot, ...codex].sort(
    (left, right) => startRank(right) - startRank(left)
  );
};

// When the session began. Claude's session file records it, Copilot's `workspace.yaml` does too, and
// Codex's thread index has a `created_at_ms` — but any of them can be missing, and a session that
// sorted as epoch zero would sit at the bottom forever, which is worse than the small amount of
// movement its last write brings.
const startRank = (agent: AgentSession): number => agent.startedAt || agent.lastActivityAt;
