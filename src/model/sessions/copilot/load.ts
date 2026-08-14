import { copilotEventsPath } from '../../../config/paths';
import { AgentSession } from '../../types';
import { CopilotEventSummary, readEvents } from './events';
import { LiveCopilotSession, liveCopilotSessions } from './live';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Two sources
// joined, and a process that no longer exists is simply not in the list.
export const loadCopilotSessions = async (): Promise<AgentSession[]> => {
  const sessions: LiveCopilotSession[] = await liveCopilotSessions();
  return Promise.all(sessions.map(toEntry));
};

const toEntry = async (session: LiveCopilotSession): Promise<AgentSession> => {
  const path: string = copilotEventsPath(session.dir);
  const summary: CopilotEventSummary = await readEvents(path);
  const startedAt: number = timestamp(session.workspace.created_at);

  return {
    sessionId: session.sessionId,
    tool: 'copilot',
    pid: session.pid,
    cwd: session.workspace.cwd,
    transcriptPath: path,
    title: session.workspace.name,
    repository: session.workspace.repository,
    branch: session.workspace.branch,
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    // A session that has written no events yet is as old as its workspace file says.
    lastActivityAt: summary.lastActivityAt || timestamp(session.workspace.updated_at) || startedAt,
    startedAt,
    version: summary.version ?? '',
    entrypoint: session.workspace.client_name ?? '',
    issues: summary.issues
  };
};

// The ISO timestamps in `workspace.yaml` → epoch ms, matching the absolute times the rest of the
// surface carries. An unparseable one reads as 0, the same as a file that couldn't be read.
const timestamp = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed: number = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};
