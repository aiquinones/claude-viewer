import { transcriptPath } from '../../config/paths';
import { AgentSession } from '../types';
import { liveSessions } from './live';
import { SessionFile } from './session-schema';
import { TranscriptSummary, readTranscript } from './transcript';

// Locate → parse → validate → typed entries, the same shape the other loaders use. The wrinkle is
// that the entries are live: two sources are joined, and a process that no longer exists is simply
// not in the list.
export const loadAgentSessions = async (): Promise<AgentSession[]> => {
  const sessions: SessionFile[] = await liveSessions();
  const entries: AgentSession[] = await Promise.all(sessions.map(toEntry));

  // Most recently active first — the agent that just did something is the one being looked for.
  return entries.sort((left, right) => right.lastActivityAt - left.lastActivityAt);
};

const toEntry = async (session: SessionFile): Promise<AgentSession> => {
  const path: string = transcriptPath({ cwd: session.cwd, sessionId: session.sessionId });
  const summary: TranscriptSummary = await readTranscript(path);
  const startedAt: number = session.startedAt ?? 0;

  return {
    sessionId: session.sessionId,
    pid: session.pid,
    // A session names itself; the fallback is only for a file written before it did.
    name: session.name ?? `pid ${session.pid}`,
    cwd: session.cwd,
    transcriptPath: path,
    title: summary.title,
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
