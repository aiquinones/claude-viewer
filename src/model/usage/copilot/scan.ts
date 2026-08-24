// Copilot's side of the usage surface. Same two numbers as Claude's out of a different shape, and
// both of them arrive less directly:
//
//   * A skill is announced once, by `skill.invoked`, and never closed. So it claims every later
//     message until the next one — inferred, where Claude's is read off the turn.
//   * Cost is a running session total on `session.usage_checkpoint` rather than a figure per
//     request, so a checkpoint's delta is shared out over the turns it covers.
//
// The whole log is read every pass rather than the tail. Both of those are running state over the
// file, so there is no offset you could resume from, and the logs are under a megabyte.

import { join } from 'node:path';
import {
  copilotEventsPath,
  copilotSessionStateDir,
  copilotWorkspacePath
} from '../../../config/paths';
import { listDirectories, readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { CopilotWorkspace, parseWorkspaceFile } from '../../sessions/copilot/workspace-schema';
import { EMPTY_TOKENS, UsageTurn } from '../types';
import { parseUsageEvent, UsageEvent } from './usage-events';

interface ScanCopilotUsageArgs {
  // The start of the widest window. Applied per turn rather than per file: unlike a transcript, one
  // session directory is cheap enough to read whole and its mtime says nothing about its old turns.
  since: number;
}

// One directory per session, so there's nothing to join and no path encoding to compute — the same
// thing that makes the Active Agents loader simpler on this side.
export const scanCopilotUsage = async ({ since }: ScanCopilotUsageArgs): Promise<UsageTurn[]> => {
  const root: string = copilotSessionStateDir();
  const ids: string[] = await listDirectories(root);

  const perSession: UsageTurn[][] = await Promise.all(
    ids.map((id) => scanSession({ dir: join(root, id), sessionId: id }))
  );

  return perSession.flat().filter((turn) => turn.at > since);
};

interface ScanSessionArgs {
  dir: string;
  sessionId: string;
}

const scanSession = async ({ dir, sessionId }: ScanSessionArgs): Promise<UsageTurn[]> => {
  const workspace: Result<string, ConfigError> = await readTextFile(copilotWorkspacePath(dir));
  if (!workspace.ok) return [];

  const parsed: CopilotWorkspace | undefined = parseWorkspaceFile(workspace.value);
  if (!parsed) return [];

  const events: Result<string, ConfigError> = await readTextFile(copilotEventsPath(dir));
  if (!events.ok) return [];

  return turnsFrom({
    text: events.value,
    sessionId,
    cwd: parsed.cwd,
    branch: parsed.branch
  });
};

interface TurnsFromArgs {
  text: string;
  sessionId: string;
  cwd: string;
  // One per session rather than one per turn: Copilot writes the branch to `workspace.yaml`, so
  // every turn in the file carries the same one. It rides a turn anyway, so the fold has one rule.
  branch: string | undefined;
}

// In file order, not timestamp order. A resumed session writes events whose clocks run backwards
// against the ones already in the file, and the order that matters here — which skill was announced
// before which message — is the order they were appended in.
const turnsFrom = ({ text, sessionId, cwd, branch }: TurnsFromArgs): UsageTurn[] => {
  const turns: UsageTurn[] = [];
  // The turns since the last checkpoint, waiting for one to say what they cost.
  let unbilled: UsageTurn[] = [];
  let skill: string | undefined;
  let billed: number = 0;

  for (const line of text.split('\n')) {
    const event: UsageEvent | undefined = parseUsageEvent(line);
    if (!event) continue;

    if (event.type === 'skill.invoked') {
      // `skill.invoked` lands about two seconds *before* the `user.message` that triggered it, so a
      // rule ordered on timestamps would start every skill's window one turn late. Position is right
      // where the clock isn't.
      skill = event.data?.name ?? skill;
      continue;
    }

    if (event.type === 'session.usage_checkpoint') {
      const total: number | undefined = event.data?.totalNanoAiu;
      if (total === undefined) continue;
      shareOut({ turns: unbilled, nanoAiu: Math.max(total - billed, 0) });
      billed = total;
      unbilled = [];
      continue;
    }

    const turn: UsageTurn | undefined = toTurn({
      event,
      sessionId,
      cwd,
      branch,
      skill
    });
    if (!turn) continue;

    turns.push(turn);
    unbilled.push(turn);
  }

  // Anything after the last checkpoint has no billed figure yet — it gets one when Copilot writes
  // the next checkpoint, and until then its tokens count and its cost doesn't. The window is applied
  // by the caller, so a turn outside it still takes its share and simply isn't returned.
  return turns;
};

interface ToTurnArgs {
  event: UsageEvent;
  sessionId: string;
  cwd: string;
  branch: string | undefined;
  skill: string | undefined;
}

const toTurn = ({ event, sessionId, cwd, branch, skill }: ToTurnArgs): UsageTurn | undefined => {
  const at: number = Date.parse(event.timestamp ?? '');
  const id: string | undefined = event.data?.messageId;
  if (!id || Number.isNaN(at)) return undefined;

  return {
    id,
    at,
    tool: 'copilot',
    sessionId,
    cwd,
    ...(branch ? { branch } : {}),
    ...(skill ? { skill } : {}),
    source: 'inferred',
    model: event.data?.model ?? '',
    // Output only. Copilot writes no input, cache-read or cache-write count anywhere on disk, and a
    // zero here means absent rather than none — which is why cost on this side is AIU, not dollars.
    tokens: { ...EMPTY_TOKENS, output: event.data?.outputTokens ?? 0 }
  };
};

interface ShareOutArgs {
  turns: UsageTurn[];
  nanoAiu: number;
}

// A checkpoint says what everything since the last one cost, together. Splitting that by output
// tokens keeps the session total exact and every prompt's total exact — the approximation only
// shows up if a skill starts partway through one checkpoint's span, which takes a skill invoked
// mid-prompt.
const shareOut = ({ turns, nanoAiu }: ShareOutArgs): void => {
  if (turns.length === 0) return;

  const output: number = turns.reduce((sum, turn) => sum + turn.tokens.output, 0);

  for (const turn of turns) {
    turn.nanoAiu = output === 0 ? nanoAiu / turns.length : (nanoAiu * turn.tokens.output) / output;
  }
};
