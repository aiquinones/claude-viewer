// Turns → one record per session. The accumulator is what a history scan keeps instead of the turns
// themselves, which is what bounds its memory: a session that ran for a month is a name, four
// numbers and one entry per day it spent something.

import { AgentTool } from '../../types';
import { SessionDay, SessionUsage, UsageTurn } from '../types';
import { dayKey } from './day';

// A session under construction. Days are held as a map while turns arrive and sorted on the way out.
export interface SessionFold {
  sessionId: string;
  tool: AgentTool;
  title?: string;
  cwd: string;
  branch?: string;
  firstAt: number;
  lastAt: number;
  outputTokens: number;
  turns: number;
  days: Map<string, SessionDay>;
}

export const emptyFold = (turn: UsageTurn): SessionFold => ({
  sessionId: turn.sessionId,
  tool: turn.tool,
  cwd: turn.cwd,
  firstAt: turn.at,
  lastAt: turn.at,
  outputTokens: 0,
  turns: 0,
  days: new Map()
});

// One turn into the fold it belongs to. `cwd` takes the latest rather than the first: entering a
// worktree rewrites a session's cwd, and where it is now is what the scope filter should read.
//
// The branch moves with it, off the same turn. A session spans several — it branches, enters a
// worktree, comes back to main — so the pair has to be read off one turn or the row names a branch
// that was never checked out in the directory beside it.
export const addTurn = (fold: SessionFold, turn: UsageTurn): void => {
  fold.firstAt = Math.min(fold.firstAt, turn.at);
  if (turn.at >= fold.lastAt) {
    fold.lastAt = turn.at;
    fold.cwd = turn.cwd;
    fold.branch = turn.branch;
  }
  fold.outputTokens += turn.tokens.output;
  fold.turns += 1;

  const key: string = dayKey(turn.at);
  const day: SessionDay | undefined = fold.days.get(key);
  if (day) {
    day.outputTokens += turn.tokens.output;
    day.turns += 1;
    return;
  }
  fold.days.set(key, { day: key, outputTokens: turn.tokens.output, turns: 1 });
};

export const foldToSession = (fold: SessionFold): SessionUsage => ({
  sessionId: fold.sessionId,
  tool: fold.tool,
  ...(fold.title ? { title: fold.title } : {}),
  cwd: fold.cwd,
  ...(fold.branch ? { branch: fold.branch } : {}),
  firstAt: fold.firstAt,
  lastAt: fold.lastAt,
  outputTokens: fold.outputTokens,
  turns: fold.turns,
  days: [...fold.days.values()].sort((left, right) => left.day.localeCompare(right.day))
});

// Turns from one source → its sessions. Used whole by the Copilot side, whose logs are read in full
// on every pass anyway; the Claude side folds incrementally instead and only calls `foldToSession`.
export const foldTurns = (turns: UsageTurn[]): SessionFold[] => {
  const bySession: Map<string, SessionFold> = new Map();

  for (const turn of turns) {
    const held: SessionFold | undefined = bySession.get(turn.sessionId);
    if (held) addTurn(held, turn);
    else {
      const fold: SessionFold = emptyFold(turn);
      addTurn(fold, turn);
      bySession.set(turn.sessionId, fold);
    }
  }

  return [...bySession.values()];
};
