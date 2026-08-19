import { transcriptPath } from '../../../config/paths';
import { AgentSession } from '../../types';
import { liveSessions } from './live';
import { SessionFile } from './session-schema';
import { TranscriptSummary, readTranscript } from './transcript';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Two sources
// joined — the session files and the transcript each one names — and a process that no longer
// exists is simply not in the list.
export const loadClaudeSessions = async (): Promise<AgentSession[]> => {
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
    context: summary.context,
    // A session that has written no transcript yet is as old as the process.
    lastActivityAt: summary.lastActivityAt || startedAt,
    startedAt,
    version: session.version ?? '',
    entrypoint: session.entrypoint ?? '',
    issues: summary.issues
  };
};
