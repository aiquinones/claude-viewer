import { SkillEntry } from '@src/model/types';
import { UsageCostBasis, UsageReport, UsageTurn } from '@src/model/usage/types';
import { buildUsageReport } from '@src/model/usage/report';
import { plainSkill } from './fixtures';

// Synthetic only, like every other fixture here — a real turn carries a real working directory and
// says what you were doing this week.
//
// Built by running the real aggregator over made-up turns rather than by writing breakdowns out by
// hand: the shares, the totals and the per-tool split then agree with each other the way they do in
// the panel, and a story can't drift from the arithmetic.
const ago = (ms: number): number => Date.now() - ms;

const MINUTE: number = 60_000;

interface TurnArgs {
  minutesAgo: number;
  skill?: string;
  output: number;
  tool?: 'claude' | 'copilot';
  model?: string;
  nanoAiu?: number;
}

let nextId: number = 0;

const turn = ({
  minutesAgo,
  skill,
  output,
  tool = 'claude',
  model,
  nanoAiu
}: TurnArgs): UsageTurn => {
  nextId += 1;

  return {
    id: `req_${nextId}`,
    at: ago(minutesAgo * MINUTE),
    tool,
    sessionId: tool === 'claude' ? 'a1b2c3d4' : 'f7be248b',
    cwd: '/Users/dev/repos/example-app',
    ...(skill ? { skill } : {}),
    source: tool === 'claude' ? 'read' : 'inferred',
    model: model ?? (tool === 'claude' ? 'claude-opus-5' : 'claude-haiku-4.5'),
    tokens: {
      input: 12,
      output,
      cacheRead: output * 30,
      cacheWrite5m: 0,
      cacheWrite1h: output * 8
    },
    ...(nanoAiu === undefined ? {} : { nanoAiu })
  };
};

const report = (turns: UsageTurn[], costBasis: UsageCostBasis = 'all'): UsageReport =>
  buildUsageReport({
    turns,
    now: Date.now(),
    scope: 'all',
    workspaceRoot: undefined,
    costBasis
  });

// A day's work under one wrapper skill, the way a real day reads: most of it attributed, a chunk of
// it not, and the rest spread over the skills that wrapper invoked.
export const dayOfWork: UsageReport = report([
  turn({ minutesAgo: 20, skill: 'dev-feature', output: 4_820 }),
  turn({ minutesAgo: 55, skill: 'dev-feature', output: 3_140 }),
  turn({ minutesAgo: 90, skill: 'create-pr', output: 1_260 }),
  turn({ minutesAgo: 140, skill: 'post-mortem', output: 640 }),
  turn({ minutesAgo: 200, output: 5_910 }),
  turn({ minutesAgo: 320, output: 2_450 }),
  turn({ minutesAgo: 30 * 60, skill: 'dev-feature', output: 6_300 }),
  turn({ minutesAgo: 50 * 60, skill: 'track', output: 880 })
]);

// Both CLIs in the same window, which is the case the units have to survive: dollars on one side,
// AIU on the other, and one skill fed by both — read on the Claude rows and inferred on the Copilot
// ones, so its row carries the tag.
export const bothClis: UsageReport = report([
  turn({ minutesAgo: 15, skill: 'dev-feature', output: 3_400 }),
  turn({ minutesAgo: 45, skill: 'dev-feature', output: 2_100 }),
  turn({ minutesAgo: 25, output: 4_800 }),
  turn({
    minutesAgo: 12,
    skill: 'dev-feature',
    output: 1_180,
    tool: 'copilot',
    nanoAiu: 8_600_000_000
  }),
  turn({
    minutesAgo: 18,
    skill: 'dev-feature',
    output: 940,
    tool: 'copilot',
    nanoAiu: 6_200_000_000
  }),
  turn({
    minutesAgo: 35,
    output: 610,
    tool: 'copilot',
    model: 'gpt-5-mini',
    nanoAiu: 1_100_000_000
  })
]);

// A model the price table doesn't know. Its tokens are in the totals and its dollars aren't, and the
// cost note says so by name — the alternative is a dollar figure that's quietly missing a model.
export const unpricedModel: UsageReport = report([
  turn({ minutesAgo: 30, skill: 'dev-feature', output: 2_600 }),
  turn({ minutesAgo: 60, output: 1_900, model: 'claude-opus-6' })
]);

// Nothing today, something this week. The Day window is the empty state and the Week window isn't,
// which is what the empty copy has to point at.
export const quietDay: UsageReport = report([
  turn({ minutesAgo: 3 * 24 * 60, skill: 'dev-feature', output: 5_400 }),
  turn({ minutesAgo: 4 * 24 * 60, output: 3_100 })
]);

// Nothing at all — a fresh machine, or a workspace scope that matches no session.
export const noUsage: UsageReport = report([]);

// The same turns as `dayOfWork`, priced on output alone. The two side by side are the argument for
// the setting: the cache reads a full figure counts are most of it, and they're context re-reads
// rather than anything a skill produced.
export const outputOnlyBasis: UsageReport = report(
  [
    turn({ minutesAgo: 20, skill: 'dev-feature', output: 4_820 }),
    turn({ minutesAgo: 90, skill: 'create-pr', output: 1_260 }),
    turn({ minutesAgo: 200, output: 5_910 })
  ],
  'output'
);

// One skill, everything. The bar scale is relative to the largest row, so this is the story that
// says a single full bar still looks deliberate.
export const oneSkill: UsageReport = report([
  turn({ minutesAgo: 10, skill: 'publish', output: 2_200 }),
  turn({ minutesAgo: 20, skill: 'publish', output: 1_800 })
]);

// Skills for the rows above to point at. `track` is deliberately not here: a window covering every
// session on the machine names skills this workspace doesn't have, and those rows have to read as
// labels — no card, no click.
const DESCRIPTIONS: Record<string, string> = {
  'dev-feature': 'Full feature development cycle — plan, implement, PR, release the worktree.',
  'create-pr': 'Branch, commit, push, and open a pull request for the current work.',
  'post-mortem': 'Reflect on the session and write what was learned back into the docs.',
  publish: 'Ship a new version — preflight, changelog, then publish.'
};

export const usageSkills: SkillEntry[] = Object.entries(DESCRIPTIONS).map(
  ([name, description]) => ({
    ...plainSkill,
    name,
    description,
    scope: 'user' as const,
    path: `/Users/dev/.claude/skills/${name}/SKILL.md`
  })
);
