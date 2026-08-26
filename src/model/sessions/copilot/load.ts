import { copilotEventsPath } from '../../../config/paths';
import { AgentSession, Subagent } from '../../types';
import { SkillTrailCache, readSkillTrail } from '../skill-trail';
import { CopilotEventSummary, readEvents } from './events';
import { LiveCopilotSession, liveCopilotSessions } from './live';
import { CopilotPrCache, pruneCopilotPrCache, readCopilotPullRequest } from './pull-request';
import { copilotSkillsIn } from './skills';
import { CopilotContexts, readCopilotContexts } from './usage-db';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Four sources
// joined now, and a process that no longer exists is simply not in the list.
//
// The contexts are read in one query for every session rather than per row: they all live in one
// database for the whole machine, unlike the per-session event logs beside them. The PR scan and
// the skill trail are the opposite — one file each, walked whole, and their caches are what keep
// that to one full read per session.
export const loadCopilotSessions = async ({
  pullRequests,
  skillTrails
}: LoadCopilotSessionsArgs): Promise<AgentSession[]> => {
  const sessions: LiveCopilotSession[] = await liveCopilotSessions();

  const contexts: Map<string, CopilotContexts> = await readCopilotContexts(
    sessions.map((session) => session.sessionId)
  );

  const entries: AgentSession[] = await Promise.all(
    sessions.map((session) => toEntry({ session, contexts, pullRequests, skillTrails }))
  );

  pruneCopilotPrCache(
    pullRequests,
    entries.map((entry) => entry.transcriptPath)
  );

  return entries;
};

interface LoadCopilotSessionsArgs {
  pullRequests: CopilotPrCache;
  // Shared with the Claude loader and pruned in `sessions/load.ts`, since neither loader can see
  // the other's paths.
  skillTrails: SkillTrailCache;
}

interface ToEntryArgs extends LoadCopilotSessionsArgs {
  session: LiveCopilotSession;
  contexts: Map<string, CopilotContexts>;
}

const toEntry = async ({
  session,
  contexts,
  pullRequests,
  skillTrails
}: ToEntryArgs): Promise<AgentSession> => {
  const path: string = copilotEventsPath(session.dir);
  const summary: CopilotEventSummary = await readEvents(path);
  const skillTrail: string[] = await readSkillTrail({
    path,
    cache: skillTrails,
    parse: copilotSkillsIn
  });
  const startedAt: number = timestamp(session.workspace.created_at);
  const read: CopilotContexts | undefined = contexts.get(session.sessionId);

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
    pullRequest: await readCopilotPullRequest({ path, cache: pullRequests }),
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    context: read?.session,
    // Absent rather than empty, the way every other field a session may not have is.
    skillTrail: skillTrail.length > 0 ? skillTrail : undefined,
    // Absent rather than empty, the way every other field only one CLI writes is.
    subagents: withContexts({ subagents: summary.subagents, read }),
    // A session that has written no events yet is as old as its workspace file says.
    lastActivityAt: summary.lastActivityAt || timestamp(session.workspace.updated_at) || startedAt,
    startedAt,
    version: summary.version ?? '',
    entrypoint: session.workspace.client_name ?? '',
    issues: summary.issues
  };
};

interface WithContextsArgs {
  subagents: Subagent[];
  read: CopilotContexts | undefined;
}

// The two halves joined: the log says which sub-agents are out and what each was asked to do, the
// usage database says how big each one's own conversation has grown. A sub-agent that hasn't
// finished a request yet is listed without a reading — it exists, it just hasn't measured anything.
const withContexts = ({ subagents, read }: WithContextsArgs): Subagent[] | undefined => {
  if (subagents.length === 0) return undefined;
  return subagents.map((subagent) => ({ ...subagent, context: read?.subagents.get(subagent.id) }));
};

// The ISO timestamps in `workspace.yaml` → epoch ms, matching the absolute times the rest of the
// surface carries. An unparseable one reads as 0, the same as a file that couldn't be read.
const timestamp = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed: number = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};
