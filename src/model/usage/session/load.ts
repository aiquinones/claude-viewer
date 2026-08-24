// One session read whole, on demand. Every other read on this surface is a scan over the machine —
// this one is a couple of files, opened because you clicked a row, and thrown away when you leave.
//
// So there is no cache and no incremental offset. The turns are the thing being drawn rather than
// something folded down to four numbers, which is exactly what `SessionUsage` can't carry.

import { join } from 'node:path';
import { copilotEventsPath, copilotSessionStateDir } from '../../../config/paths';
import { readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { AgentTool } from '../../types';
import { parseClaudeTurns } from '../claude/scan';
import { parseClaudeInvocations } from '../claude/invocations';
import { parseCopilotInvocations } from '../copilot/invocations';
import { scanCopilotUsage } from '../copilot/scan';
import { SessionDetail, SkillInvocation, UsageTurn } from '../types';

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
}: LoadSessionDetailArgs): Promise<SessionDetail> =>
  tool === 'claude'
    ? loadClaudeSession({ sessionId, transcriptPaths })
    : loadCopilotSession(sessionId);

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

  return finish({ sessionId, tool: 'claude', turns, invocations });
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

  return finish({
    sessionId,
    tool: 'copilot',
    turns: all.filter((turn) => turn.sessionId === sessionId),
    invocations: parseCopilotInvocations(events.value)
  });
};

interface FinishArgs {
  sessionId: string;
  tool: AgentTool;
  turns: UsageTurn[];
  invocations: SkillInvocation[];
}

// Turns sorted, invocations left in the order they were read. A resumed session writes clocks that
// run backwards against what's already in the file, so the chart sorts and the loads keep file
// order — which is the order they entered the context.
const finish = ({ sessionId, tool, turns, invocations }: FinishArgs): SessionDetail => ({
  sessionId,
  tool,
  turns: [...turns].sort((left, right) => left.at - right.at),
  invocations
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
  error
});
