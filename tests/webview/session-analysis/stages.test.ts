import { describe, expect, it } from 'vitest';
import { toStages } from '@src/webview/session-analysis/stages';
import {
  ContextPoint,
  EMPTY_TOKENS,
  SkillInvocation,
  UsageTurn
} from '@src/model/usage/types';

// What's under test is where the cuts fall. Every number on the radars is a sum over a span, so a
// boundary in the wrong place is wrong twice — it overstates one stage and understates its
// neighbour, and both of them still look plausible.

interface TurnArgs {
  at: number;
  output?: number;
}

// Output tokens only: the metric these tests read is `output-tokens`, so the turn's other counters
// have nothing to say about the sums being asserted.
const turn = ({ at, output = 0 }: TurnArgs): UsageTurn => ({
  id: `req_${at}`,
  at,
  tool: 'claude',
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model: 'claude-opus-5',
  tokens: { ...EMPTY_TOKENS, output }
});

interface LoadArgs {
  skill: string;
  at: number;
}

const load = ({ skill, at }: LoadArgs): SkillInvocation => ({ skill, at, via: 'tool' });

const context = (at: number, tokens: number): ContextPoint => ({
  at,
  tokens,
  model: 'claude-opus-5'
});

interface StagesArgs {
  turns?: UsageTurn[];
  invocations?: SkillInvocation[];
  contexts?: ContextPoint[];
  names?: Record<string, string>;
}

const stagesOf = ({ turns = [], invocations = [], contexts = [], names = {} }: StagesArgs) =>
  toStages({ turns, invocations, contexts, metric: 'output-tokens', names });

describe('toStages', () => {
  it('runs a stage from its skill load to the next one', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      turns: [
        turn({ at: 10, output: 100 }),
        turn({ at: 20, output: 200 }),
        turn({ at: 30, output: 400 }),
        turn({ at: 40, output: 800 })
      ]
    });

    expect(stages.map((stage) => [stage.skill, stage.value, stage.turns])).toEqual([
      ['design', 300, 2],
      ['commit', 1_200, 2]
    ]);
  });

  // The gap before the first load. Those turns happened, but nothing on disk says which stage they
  // belong to, and a bucket named for that would be a guess with a label on it.
  it('drops the turns before the first skill load', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 50 })],
      turns: [turn({ at: 10, output: 999 }), turn({ at: 50, output: 7 })]
    });

    expect(stages).toHaveLength(1);
    expect(stages[0].value).toBe(7);
  });

  it('has no stages at all when the session loaded no skills', () => {
    expect(stagesOf({ turns: [turn({ at: 1, output: 500 })] })).toEqual([]);
  });

  // Copilot injects a skill because you typed its name, then loads it again seconds later when the
  // model asks for what it already has. A boundary at the second load makes a stage that's five
  // seconds wide and steals nothing but the first stage's name.
  it('does not open a second stage for a repeat load of the running skill', () => {
    const stages = stagesOf({
      invocations: [
        load({ skill: 'dev-feature', at: 10 }),
        load({ skill: 'dev-feature', at: 15 }),
        load({ skill: 'commit', at: 40 })
      ],
      turns: [turn({ at: 20, output: 100 }), turn({ at: 40, output: 60 })]
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['dev-feature', 'commit']);
    expect(stages[0].stages).toBe(1);
    expect(stages[0].value).toBe(100);
  });

  // One axis per skill, whatever the session did in between — two axes carrying one label is a
  // chart nobody can read.
  it('folds a skill that opens a stage twice into one entry', () => {
    const stages = stagesOf({
      invocations: [
        load({ skill: 'commit', at: 10 }),
        load({ skill: 'review', at: 20 }),
        load({ skill: 'commit', at: 30 })
      ],
      turns: [turn({ at: 10, output: 5 }), turn({ at: 20, output: 50 }), turn({ at: 30, output: 7 })]
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['commit', 'review']);
    expect(stages[0]).toMatchObject({ value: 12, stages: 2, turns: 2, firstAt: 10 });
  });

  it('sorts the spokes by when each skill first opened a stage', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'zulu', at: 10 }), load({ skill: 'alpha', at: 20 })]
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['zulu', 'alpha']);
  });

  // The reading before the stage started is the baseline, so the body the skill loaded counts
  // against the stage that loaded it — which is most of what makes a stage expensive.
  it('measures growth from the last reading before the stage began', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      contexts: [context(5, 1_000), context(10, 9_000), context(30, 12_000), context(40, 20_000)]
    });

    expect(stages.map((stage) => stage.growth)).toEqual([8_000, 11_000]);
  });

  // The first stage usually has no earlier reading — the gap before it recorded nothing — so it
  // measures from its own first point and the body it loaded rides in the baseline.
  it('falls back to its own first reading when nothing precedes the stage', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 })],
      contexts: [context(10, 9_000), context(20, 15_000)]
    });

    expect(stages[0].growth).toBe(6_000);
  });

  // A compaction really does hand context back. The radar clamps it; this must not, or the bubble
  // would have nothing true to print.
  it('keeps a negative growth rather than clamping it', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 })],
      contexts: [context(5, 90_000), context(10, 92_000), context(20, 30_000)]
    });

    expect(stages[0].growth).toBe(-60_000);
  });

  it('reports no growth for a stage nothing measured', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      contexts: [context(10, 5_000), context(20, 8_000)]
    });

    expect(stages.map((stage) => stage.growth)).toEqual([3_000, 0]);
  });

  it('labels a stage with its override and says the label was not the skill', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'dev-feature', at: 10 }), load({ skill: 'commit', at: 20 })],
      names: { 'dev-feature': 'Build', 'never-ran': 'Elsewhere' }
    });

    expect(stages.map((stage) => [stage.label, stage.renamed])).toEqual([
      ['Build', true],
      ['commit', false]
    ]);
  });

  // A resumed session writes its turns out of order often enough that the fold can't assume file
  // order is time order.
  it('reads spans off the clock rather than off the order it was handed', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'commit', at: 30 }), load({ skill: 'design', at: 10 })],
      turns: [turn({ at: 40, output: 9 }), turn({ at: 15, output: 4 })]
    });

    expect(stages.map((stage) => [stage.skill, stage.value])).toEqual([
      ['design', 4],
      ['commit', 9]
    ]);
  });
});
