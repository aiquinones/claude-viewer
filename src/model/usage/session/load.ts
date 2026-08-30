// One session read whole, on demand. Every other read on this surface is a scan over the machine —
// this one is a couple of files, opened because you clicked a row, and thrown away when you leave.
//
// So there is no cache and no incremental offset. The turns are the thing being drawn rather than
// something folded down to four numbers, which is exactly what `SessionUsage` can't carry.

import { join } from 'node:path';
import { copilotEventsPath, copilotSessionStateDir } from '../../../config/paths';
import { readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { CodexThread, readAllCodexThreads } from '../../sessions/codex/threads-db';
import { readCopilotContextSeries } from '../../sessions/copilot/usage-db';
import { AgentTool } from '../../types';
import { parseClaudeTurns } from '../claude/scan';
import { parseClaudeInvocations } from '../claude/invocations';
import { parseCodexInvocations } from '../codex/invocations';
import { parseCodexTurns } from '../codex/scan';
import { parseCopilotInvocations } from '../copilot/invocations';
import { scanCopilotUsage } from '../copilot/scan';
import { ContextPoint, SessionDetail, SkillInvocation, UsageTurn } from '../types';
import { contextPointsFromTurns } from './contexts';
import { sizeCodexLoads } from './skill-sizes';

interface LoadSessionDetailArgs {
  sessionId: string;
  tool: AgentTool;
  // The transcripts holding this session, which only the host's history cache can say. Claude names
  // its files by a uuid that isn't the session id, and a resumed session spans more than one.
  // Ignored for Copilot, whose session id *is* its directory name.
  transcriptPaths: string[];
}

export const loadSessionDetail = async ({
  sessionId,
  tool,
  transcriptPaths
}: LoadSessionDetailArgs): Promise<SessionDetail> => {
  if (tool === 'claude') return loadClaudeSession({ sessionId, transcriptPaths });
  if (tool === 'codex') return loadCodexSession(sessionId);
  return loadCopilotSession(sessionId);
};

interface LoadClaudeSessionArgs {
  sessionId: string;
  transcriptPaths: string[];
}

// Every transcript the session touched, read whole and filtered to its own lines. A transcript can
// hold turns from two sessions — that's what a resume looks like — so the filter is on the turn
// rather than on the file.
const loadClaudeSession = async ({
  sessionId,
  transcriptPaths
}: LoadClaudeSessionArgs): Promise<SessionDetail> => {
  if (transcriptPaths.length === 0) {
    return empty({ sessionId, tool: 'claude', error: 'No transcript found for this session.' });
  }

  const turns: UsageTurn[] = [];
  const invocations: SkillInvocation[] = [];
  let read: number = 0;

  for (const path of transcriptPaths) {
    const text: Result<string, ConfigError> = await readTextFile(path);
    if (!text.ok) continue;
    read += 1;

    const lines: string[] = text.value.split('\n');
    turns.push(...parseClaudeTurns(lines).filter((turn) => turn.sessionId === sessionId));
    invocations.push(...parseClaudeInvocations(lines));
  }

  if (read === 0) {
    return empty({ sessionId, tool: 'claude', error: "This session's transcript couldn't be read." });
  }

  return finish({
    sessionId,
    tool: 'claude',
    turns,
    invocations,
    contexts: contextPointsFromTurns(turns)
  });
};

// One directory, so there is nothing to resolve. The turns come back through the ordinary scan —
// its checkpoint arithmetic is running state over the whole log and can't be applied to a slice of
// it — narrowed to this session on the way out.
const loadCopilotSession = async (sessionId: string): Promise<SessionDetail> => {
  const dir: string = join(copilotSessionStateDir(), sessionId);
  const events: Result<string, ConfigError> = await readTextFile(copilotEventsPath(dir));

  if (!events.ok) {
    return empty({ sessionId, tool: 'copilot', error: "This session's event log couldn't be read." });
  }

  const all: UsageTurn[] = await scanCopilotUsage({ since: 0 });

  // Not from the turns: the event log carries output tokens and nothing else, so the prompt size is
  // only ever in the database the CLI files its ephemeral usage events into.
  const contexts: ContextPoint[] = await readCopilotContextSeries(sessionId);

  return finish({
    sessionId,
    tool: 'copilot',
    turns: all.filter((turn) => turn.sessionId === sessionId),
    invocations: parseCopilotInvocations(events.value),
    contexts
  });
};

// One thread, and the database says which file it is — so unlike Claude there is nothing to resolve
// against a cache, and unlike Copilot there is no scan over every session to narrow afterwards.
//
// The skill loads are read off the commands the agent ran, since Codex has no skill event and loads
// a skill by reading its file — `usage/codex/invocations.ts` holds what that costs to get right.
// The upside of a record that is a path: the size can be measured off the file the session actually
// read, so a skill this panel doesn't list still gets a number.
const loadCodexSession = async (sessionId: string): Promise<SessionDetail> => {
  const threads: Map<string, CodexThread> = await readAllCodexThreads();
  const thread: CodexThread | undefined = threads.get(sessionId);

  if (!thread) {
    return empty({ sessionId, tool: 'codex', error: 'No thread found for this session.' });
  }

  const text: Result<string, ConfigError> = await readTextFile(thread.rolloutPath);

  if (!text.ok) {
    return empty({ sessionId, tool: 'codex', error: "This session's rollout couldn't be read." });
  }

  const lines: string[] = text.value.split('\n');
  const turns: UsageTurn[] = parseCodexTurns({ lines, thread });

  return finish({
    sessionId,
    tool: 'codex',
    turns,
    invocations: await sizeCodexLoads({ loads: parseCodexInvocations(lines), cwd: thread.cwd }),
    // The same sum Claude's side does, and correct here for the same reason: `scan.ts` converts
    // Codex's inclusive counters into the disjoint ones before they ever reach this.
    contexts: contextPointsFromTurns(turns)
  });
};

interface FinishArgs {
  sessionId: string;
  tool: AgentTool;
  turns: UsageTurn[];
  invocations: SkillInvocation[];
  contexts: ContextPoint[];
}

// Turns sorted, invocations left in the order they were read. A resumed session writes clocks that
// run backwards against what's already in the file, so the chart sorts and the loads keep file
// order — which is the order they entered the context.
const finish = ({ sessionId, tool, turns, invocations, contexts }: FinishArgs): SessionDetail => ({
  sessionId,
  tool,
  turns: [...turns].sort((left, right) => left.at - right.at),
  invocations,
  contexts
});

interface EmptyArgs {
  sessionId: string;
  tool: AgentTool;
  error: string;
}

const empty = ({ sessionId, tool, error }: EmptyArgs): SessionDetail => ({
  sessionId,
  tool,
  turns: [],
  invocations: [],
  contexts: [],
  error
});
