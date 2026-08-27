import { describe, expect, it } from 'vitest';
import { invokedSkills, toStages } from '@src/webview/session-analysis/stages';
import {
  ContextPoint,
  EMPTY_TOKENS,
  SkillInvocation,
  UsageTurn
} from '@src/model/usage/types';

// What's under test is where the cuts fall. Every number on the radars is a sum over a span, so a
// boundary in the wrong place is wrong twice — it overstates one stage and understates its
// neighbour, and both of them still look plausible. A cut falls at a *named* skill's load, so
// almost every case here has to hand over names as well as loads.

interface TurnArgs {
  at: number;
  // What the turn cost, in the unit `turnValue` reads off a Copilot turn.
  cost?: number;
}

// Copilot turns, because Copilot records what a turn cost and Claude's is derived from the rate
// card. What's under test is where the cuts fall, so the sums want to be exact integers the test
// writes rather than dollars that move when `pricing.ts` is next updated.
const turn = ({ at, cost = 0 }: TurnArgs): UsageTurn => ({
  id: `req_${at}`,
  at,
  tool: 'copilot',
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model: 'claude-opus-5',
  tokens: EMPTY_TOKENS,
  nanoAiu: cost
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

// Naming a skill is what makes it a stage, so a test that wants a stage has to name the skill. The
// name doubles as the label, which is why these read as words rather than as the skill's own name.
const named = (...skills: string[]): Record<string, string> =>
  Object.fromEntries(skills.map((skill) => [skill, skill.toUpperCase()]));

const stagesOf = ({ turns = [], invocations = [], contexts = [], names = {} }: StagesArgs) =>
  toStages({ turns, invocations, contexts, names });

describe('toStages', () => {
  it('runs a stage from its skill load to the next one', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      names: named('design', 'commit'),
      turns: [
        turn({ at: 10, cost: 100 }),
        turn({ at: 20, cost: 200 }),
        turn({ at: 30, cost: 400 }),
        turn({ at: 40, cost: 800 })
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
      names: named('design'),
      turns: [turn({ at: 10, cost: 999 }), turn({ at: 50, cost: 7 })]
    });

    expect(stages).toHaveLength(1);
    expect(stages[0].value).toBe(7);
  });

  it('has no stages at all when the session loaded no skills', () => {
    expect(stagesOf({ turns: [turn({ at: 1, cost: 500 })] })).toEqual([]);
  });

  // The state the section draws a card for rather than two empty wheels. Skills ran, so there is a
  // split to be had; nobody has chosen it, so there is nothing to draw.
  it('has no stages while none of the skills that ran is named', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      turns: [turn({ at: 10, cost: 100 }), turn({ at: 30, cost: 200 })]
    });

    expect(stages).toEqual([]);
  });

  // The ignore half of the feature. An unnamed load isn't a boundary, so the turns either side of
  // it belong to whatever stage was already running.
  it('runs a stage straight through the loads of skills nobody named', () => {
    const stages = stagesOf({
      invocations: [
        load({ skill: 'dev-feature', at: 10 }),
        load({ skill: 'commit', at: 20 }),
        load({ skill: 'review', at: 30 })
      ],
      names: named('dev-feature'),
      turns: [
        turn({ at: 10, cost: 1 }),
        turn({ at: 20, cost: 2 }),
        turn({ at: 30, cost: 4 }),
        turn({ at: 40, cost: 8 })
      ]
    });

    expect(stages.map((stage) => [stage.skill, stage.value, stage.turns])).toEqual([
      ['dev-feature', 15, 4]
    ]);
  });

  // Filtering happens before the repeat rule, so a named skill interrupted only by unnamed ones is
  // still one stage. Splitting it would be a cut the reader can't see the reason for.
  it('does not reopen a stage when an unnamed skill ran in the middle of it', () => {
    const stages = stagesOf({
      invocations: [
        load({ skill: 'dev-feature', at: 10 }),
        load({ skill: 'commit', at: 20 }),
        load({ skill: 'dev-feature', at: 30 })
      ],
      names: named('dev-feature'),
      turns: [turn({ at: 10, cost: 5 }), turn({ at: 30, cost: 5 })]
    });

    expect(stages).toHaveLength(1);
    expect(stages[0]).toMatchObject({ skill: 'dev-feature', stages: 1, turns: 2, value: 10 });
  });

  // A blank name is how the dialog says "not a stage", so it has to read as absent rather than as a
  // stage labelled with nothing.
  it('treats a blank name as not a stage', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 20 })],
      names: { design: '   ', commit: 'Ship' }
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['commit']);
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
      names: named('dev-feature', 'commit'),
      turns: [turn({ at: 20, cost: 100 }), turn({ at: 40, cost: 60 })]
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
      names: named('commit', 'review'),
      turns: [turn({ at: 10, cost: 5 }), turn({ at: 20, cost: 50 }), turn({ at: 30, cost: 7 })]
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['commit', 'review']);
    expect(stages[0]).toMatchObject({ value: 12, stages: 2, turns: 2, firstAt: 10 });
  });

  it('sorts the spokes by when each skill first opened a stage', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'zulu', at: 10 }), load({ skill: 'alpha', at: 20 })],
      names: named('zulu', 'alpha')
    });

    expect(stages.map((stage) => stage.skill)).toEqual(['zulu', 'alpha']);
  });

  // The reading before the stage started is the baseline, so the body the skill loaded counts
  // against the stage that loaded it — which is most of what makes a stage expensive.
  it('measures growth from the last reading before the stage began', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      names: named('design', 'commit'),
      contexts: [context(5, 1_000), context(10, 9_000), context(30, 12_000), context(40, 20_000)]
    });

    expect(stages.map((stage) => stage.growth)).toEqual([8_000, 11_000]);
  });

  // The first stage usually has no earlier reading — the gap before it recorded nothing — so it
  // measures from its own first point and the body it loaded rides in the baseline.
  it('falls back to its own first reading when nothing precedes the stage', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 })],
      names: named('design'),
      contexts: [context(10, 9_000), context(20, 15_000)]
    });

    expect(stages[0].growth).toBe(6_000);
  });

  // A compaction really does hand context back. The radar clamps it; this must not, or the bubble
  // would have nothing true to print.
  it('keeps a negative growth rather than clamping it', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 })],
      names: named('design'),
      contexts: [context(5, 90_000), context(10, 92_000), context(20, 30_000)]
    });

    expect(stages[0].growth).toBe(-60_000);
  });

  it('reports no growth for a stage nothing measured', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'design', at: 10 }), load({ skill: 'commit', at: 30 })],
      names: named('design', 'commit'),
      contexts: [context(10, 5_000), context(20, 8_000)]
    });

    expect(stages.map((stage) => stage.growth)).toEqual([3_000, 0]);
  });

  // A name for a skill this session never ran says nothing about this session — the map is global
  // and every other session's names are in it too.
  it('labels a stage with its name and ignores names for skills that never ran', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'dev-feature', at: 10 }), load({ skill: 'commit', at: 20 })],
      names: { 'dev-feature': 'Build', 'never-ran': 'Elsewhere' }
    });

    expect(stages.map((stage) => [stage.skill, stage.label])).toEqual([['dev-feature', 'Build']]);
  });

  // A resumed session writes its turns out of order often enough that the fold can't assume file
  // order is time order.
  it('reads spans off the clock rather than off the order it was handed', () => {
    const stages = stagesOf({
      invocations: [load({ skill: 'commit', at: 30 }), load({ skill: 'design', at: 10 })],
      names: named('commit', 'design'),
      turns: [turn({ at: 40, cost: 9 }), turn({ at: 15, cost: 4 })]
    });

    expect(stages.map((stage) => [stage.skill, stage.value])).toEqual([
      ['design', 4],
      ['commit', 9]
    ]);
  });
});

// What the naming dialog lists. Not the stages — the choice being made there is which skills become
// stages, so a list of the stages would leave out every row worth adding.
describe('invokedSkills', () => {
  it('lists every skill that ran, once, in the order it first did', () => {
    const skills = invokedSkills([
      load({ skill: 'dev-feature', at: 10 }),
      load({ skill: 'commit', at: 20 }),
      load({ skill: 'dev-feature', at: 30 })
    ]);

    expect(skills).toEqual(['dev-feature', 'commit']);
  });

  // A resumed session writes its loads out of order, the same reason the spans are read off the
  // clock rather than off file position.
  it('orders by the clock rather than by the order it was handed', () => {
    const skills = invokedSkills([load({ skill: 'commit', at: 30 }), load({ skill: 'design', at: 10 })]);

    expect(skills).toEqual(['design', 'commit']);
  });

  it('lists nothing for a session that loaded no skills', () => {
    expect(invokedSkills([])).toEqual([]);
  });
});
