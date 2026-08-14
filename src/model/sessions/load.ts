import { transcriptPath } from '../../config/paths';
import { AgentSession } from '../types';
import { loadCopilotSessions } from './copilot/load';
import { liveSessions } from './live';
import { SessionFile } from './session-schema';
import { TranscriptSummary, readTranscript } from './transcript';

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

// Locate → parse → validate → typed entries, the same shape the other loaders use. The wrinkle is
// that the entries are live: two sources are joined, and a process that no longer exists is simply
// not in the list.
const loadClaudeSessions = async (): Promise<AgentSession[]> => {
  const sessions: SessionFile[] = await liveSessions();
  return Promise.all(sessions.map(toEntry));
};

const toEntry = async (session: SessionFile): Promise<AgentSession> => {
  const path: string = transcriptPath({ cwd: session.cwd, sessionId: session.sessionId });
  const summary: TranscriptSummary = await readTranscript(path);
  const startedAt: number = session.startedAt ?? 0;

  return {
    sessionId: session.sessionId,
    tool: 'claude',
    pid: session.pid,
    cwd: session.cwd,
    transcriptPath: path,
    title: summary.title,
    pullRequest: summary.pullRequest,
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    // A session that has written no transcript yet is as old as the process.
    lastActivityAt: summary.lastActivityAt || startedAt,
    startedAt,
    version: session.version ?? '',
    entrypoint: session.entrypoint ?? '',
    issues: summary.issues
  };
};
