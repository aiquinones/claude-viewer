import { transcriptPath } from '../../../config/paths';
import { AgentSession } from '../../types';
import { SkillTrailCache, readSkillTrail } from '../skill-trail';
import { LiveClaudeSession, liveSessions } from './live';
import { claudeSkillsIn } from './skills';
import { TranscriptSummary, readTranscript } from './transcript';

// Locate → parse → validate → typed entries, the same shape every other loader uses. Two sources
// joined — the session files and the transcript each one names — and a process that no longer
// exists is simply not in the list.
//
// The one thing held between passes is the skill trail: it's the only field read from the whole
// file rather than from an end of it, and the cache is what keeps that to one full read per
// session. Pruned in `sessions/load.ts` — one cache serves both CLIs, so neither loader can be the
// thing that drops entries it can't see.
export const loadClaudeSessions = async (skillTrails: SkillTrailCache): Promise<AgentSession[]> => {
  const sessions: LiveClaudeSession[] = await liveSessions();
  const entries: (AgentSession | undefined)[] = await Promise.all(
    sessions.map((live) => toEntry({ live, skillTrails }))
  );

  return entries.filter((entry): entry is AgentSession => entry !== undefined);
};

interface ToEntryArgs {
  live: LiveClaudeSession;
  skillTrails: SkillTrailCache;
}

// A live process whose transcript doesn't exist has never been prompted — no title, no turn, no
// context — so it isn't a row. Claude Code leaves these behind: resuming a conversation spawns a
// second process and abandons the first, which stays alive attached to nothing.
const toEntry = async ({
  live: { session, otherPids },
  skillTrails
}: ToEntryArgs): Promise<AgentSession | undefined> => {
  const path: string = transcriptPath({ cwd: session.cwd, sessionId: session.sessionId });
  const summary: TranscriptSummary = await readTranscript(path);
  if (summary.missing) return undefined;

  const skillTrail: string[] = await readSkillTrail({
    path,
    cache: skillTrails,
    parse: claudeSkillsIn
  });

  const startedAt: number = session.startedAt ?? 0;

  return {
    sessionId: session.sessionId,
    tool: 'claude',
    pid: session.pid,
    otherPids,
    cwd: session.cwd,
    transcriptPath: path,
    title: summary.title,
    pullRequest: summary.pullRequest,
    lastPrompt: summary.lastPrompt,
    tail: summary.tail,
    pendingTool: summary.pendingTool,
    context: summary.context,
    // Absent rather than empty, the way every other field a session may not have is.
    skillTrail: skillTrail.length > 0 ? skillTrail : undefined,
    // A session that has written no transcript yet is as old as the process.
    lastActivityAt: summary.lastActivityAt || startedAt,
    startedAt,
    version: session.version ?? '',
    entrypoint: session.entrypoint ?? '',
    issues: summary.issues
  };
};
