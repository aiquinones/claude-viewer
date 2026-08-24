import { describe, expect, it } from 'vitest';
import { contextPointsFromTurns } from '@src/model/usage/session/contexts';
import { EMPTY_TOKENS, UsageTokens, UsageTurn } from '@src/model/usage/types';

// The claim under test is the one that's easy to get backwards: Anthropic's three input counters are
// disjoint slices of one prompt, so the prompt is all three added up — where Copilot's single
// `input_tokens` already includes both cache figures and is read somewhere else entirely.

interface TurnArgs {
  at: number;
  tokens?: Partial<UsageTokens>;
  tool?: 'claude' | 'copilot';
  model?: string;
}

const turn = ({ at, tokens = {}, tool = 'claude', model = 'claude-opus-5' }: TurnArgs): UsageTurn => ({
  id: `req_${at}`,
  at,
  tool,
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model,
  tokens: { ...EMPTY_TOKENS, ...tokens }
});

describe('contextPointsFromTurns', () => {
  it('adds the three input counters and leaves output out of it', () => {
    const points = contextPointsFromTurns([
      turn({ at: 1, tokens: { input: 120, cacheRead: 40_000, cacheWrite5m: 600, cacheWrite1h: 80, output: 9_999 } })
    ]);

    expect(points).toEqual([{ at: 1, model: 'claude-opus-5', tokens: 40_800 }]);
  });

  it('grows across a session, because every turn re-reads the conversation', () => {
    const points = contextPointsFromTurns([
      turn({ at: 1, tokens: { input: 20, cacheRead: 10_000 } }),
      turn({ at: 2, tokens: { input: 20, cacheRead: 14_500 } }),
      turn({ at: 3, tokens: { input: 20, cacheRead: 19_100 } })
    ]);

    expect(points.map((point) => point.tokens)).toEqual([10_020, 14_520, 19_120]);
  });

  // A compaction really does drop the conversation back down, so nothing here may assume the series
  // only climbs.
  it('keeps a drop rather than smoothing it', () => {
    const points = contextPointsFromTurns([
      turn({ at: 1, tokens: { cacheRead: 90_000 } }),
      turn({ at: 2, tokens: { cacheRead: 30_000 } })
    ]);

    expect(points.map((point) => point.tokens)).toEqual([90_000, 30_000]);
  });

  // Every Copilot turn, since its event log records output tokens and nothing else. A point at zero
  // would be a claim that the context was empty; no point at all sends the chart to its own message.
  it('drops a turn whose counters are all zero', () => {
    const points = contextPointsFromTurns([
      turn({ at: 1, tool: 'copilot', tokens: { output: 4_200 } }),
      turn({ at: 2, tool: 'copilot', tokens: { output: 900 } })
    ]);

    expect(points).toEqual([]);
  });

  it('sorts by the clock, because a resumed session writes turns out of order', () => {
    const points = contextPointsFromTurns([
      turn({ at: 30, tokens: { cacheRead: 3 } }),
      turn({ at: 10, tokens: { cacheRead: 1 } }),
      turn({ at: 20, tokens: { cacheRead: 2 } })
    ]);

    expect(points.map((point) => point.at)).toEqual([10, 20, 30]);
  });
});
