import { describe, expect, it } from 'vitest';
import { EMPTY_TOKENS, SessionUsage, UsageTurn } from '@src/model/usage/types';
import { foldToSession, foldTurns } from '@src/model/usage/history/fold';

const AT: number = new Date(2026, 7, 20, 12).getTime();

const MINUTE_MS: number = 60 * 1000;

interface TurnArgs {
  id: string;
  // Minutes after AT, so a test can write the order it means rather than timestamps.
  minute: number;
  cwd: string;
  branch?: string;
}

// Only the fields the fold reads carry anything. What a turn cost isn't the subject here — where it
// ran is.
const turn = ({ id, minute, cwd, branch }: TurnArgs): UsageTurn => ({
  id,
  at: AT + minute * MINUTE_MS,
  tool: 'claude',
  sessionId: 'session-1',
  cwd,
  ...(branch ? { branch } : {}),
  source: 'read',
  model: 'claude-opus-5',
  tokens: { ...EMPTY_TOKENS, output: 100 }
});

const fold = (turns: UsageTurn[]): SessionUsage => foldToSession(foldTurns(turns)[0]);

describe('the branch a folded session carries', () => {
  // The rule `cwd` already followed, applied to the pair: a session branches, enters a worktree and
  // comes back, and where it left off is what a list sorted by last activity is about.
  it('comes off the latest turn, not the first', () => {
    const session: SessionUsage = fold([
      turn({ id: 'a', minute: 0, cwd: '/repo', branch: 'main' }),
      turn({ id: 'b', minute: 5, cwd: '/repo/.claude/worktrees/feat+grid', branch: 'feat/grid' })
    ]);

    expect(session.branch).toBe('feat/grid');
    expect(session.cwd).toBe('/repo/.claude/worktrees/feat+grid');
  });

  // Turns arrive in file order, and a resumed session writes clocks that run backwards against the
  // ones already there. The latest is by timestamp, not by position.
  it('ignores a turn that lands out of order', () => {
    const session: SessionUsage = fold([
      turn({ id: 'a', minute: 10, cwd: '/repo', branch: 'feat/grid' }),
      turn({ id: 'b', minute: 2, cwd: '/other', branch: 'main' })
    ]);

    expect(session.branch).toBe('feat/grid');
    expect(session.cwd).toBe('/repo');
  });

  // Moving to a directory that is no repo drops the label rather than carrying the last branch
  // forward — a stale branch name reads as a fact.
  it('goes away when the latest turn has none', () => {
    const session: SessionUsage = fold([
      turn({ id: 'a', minute: 0, cwd: '/repo', branch: 'main' }),
      turn({ id: 'b', minute: 5, cwd: '/tmp/scratch' })
    ]);

    expect(session.branch).toBeUndefined();
  });

  // Absent, not an empty string. The row tests the field for truthiness, so a blank one would draw
  // a branch icon with nothing beside it.
  it('is absent when no turn ever had one', () => {
    const session: SessionUsage = fold([turn({ id: 'a', minute: 0, cwd: '/tmp/scratch' })]);

    expect('branch' in session).toBe(false);
  });
});
