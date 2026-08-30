import { AgentSession } from '../../types';
import { liveCodexThreadIds } from './live';
import { CodexRolloutSummary, readRollout } from './rollout';
import { CodexThread, readCodexThreads, threadTitle } from './threads-db';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Two sources
// joined: the lock directory says which threads are live, and one query against the thread index
// says everything about them that isn't in the log.
//
// The index is read in one query for every row rather than per row — it's one database for the whole
// machine, the way Copilot's usage store is. A thread with no row in it is dropped rather than drawn
// blank: the lock lands before the row does, so a session in its first moments is normal and
// appearing a poll later is the right outcome.
export const loadCodexSessions = async (): Promise<AgentSession[]> => {
  const threadIds: string[] = await liveCodexThreadIds();
  if (threadIds.length === 0) return [];

  const threads: Map<string, CodexThread> = await readCodexThreads(threadIds);

  const live: CodexThread[] = threadIds
    .map((threadId) => threads.get(threadId))
    .filter((thread): thread is CodexThread => thread !== undefined)
    // A sub-agent Codex spawned is a thread of its own, with its own lock and its own rollout — so
    // without this a session that delegated once draws two rows for one agent. Same call the Copilot
    // context series makes: a sub-agent is a conversation this row isn't about.
    .filter((thread) => !thread.isSubagent);

  return Promise.all(live.map(toEntry));
};

const toEntry = async (thread: CodexThread): Promise<AgentSession> => {
  const summary: CodexRolloutSummary = await readRollout(thread.rolloutPath);

  return {
    sessionId: thread.threadId,
    tool: 'codex',
    // No pid: Codex records one nowhere. See `live.ts` — this is what takes Kill and Focus off a
    // Codex row rather than pointing them at a guess.
    otherPids: [],
    cwd: thread.cwd,
    transcriptPath: thread.rolloutPath,
    title: threadTitle(thread),
    repository: thread.repository,
    branch: thread.branch,
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    context: summary.contextTokens
      ? { tokens: summary.contextTokens, model: thread.model, window: summary.contextWindow }
      : undefined,
    // A thread that has written no rollout line yet is as old as the index says.
    lastActivityAt: summary.lastActivityAt || thread.updatedAt || thread.createdAt,
    startedAt: thread.createdAt,
    version: '',
    entrypoint: '',
    issues: summary.issues
  };
};
