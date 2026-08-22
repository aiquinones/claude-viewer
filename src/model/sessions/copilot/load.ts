import { copilotEventsPath } from '../../../config/paths';
import { AgentContext, AgentSession } from '../../types';
import { CopilotEventSummary, readEvents } from './events';
import { LiveCopilotSession, liveCopilotSessions } from './live';
import { readCopilotContexts } from './usage-db';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Three sources
// joined now, and a process that no longer exists is simply not in the list.
//
// The contexts are read in one query for every session rather than per row: they all live in one
// database for the whole machine, unlike the per-session event logs beside them.
export const loadCopilotSessions = async (): Promise<AgentSession[]> => {
  const sessions: LiveCopilotSession[] = await liveCopilotSessions();

  const contexts: Map<string, AgentContext> = await readCopilotContexts(
    sessions.map((session) => session.sessionId)
  );

  return Promise.all(sessions.map((session) => toEntry({ session, contexts })));
};

interface ToEntryArgs {
  session: LiveCopilotSession;
  contexts: Map<string, AgentContext>;
}

const toEntry = async ({ session, contexts }: ToEntryArgs): Promise<AgentSession> => {
  const path: string = copilotEventsPath(session.dir);
  const summary: CopilotEventSummary = await readEvents(path);
  const startedAt: number = timestamp(session.workspace.created_at);

  return {
    sessionId: session.sessionId,
    tool: 'copilot',
    pid: session.pid,
    otherPids: session.otherPids,
    cwd: session.workspace.cwd,
    transcriptPath: path,
    title: session.workspace.name,
    repository: session.workspace.repository,
    branch: session.workspace.branch,
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    context: contexts.get(session.sessionId),
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
