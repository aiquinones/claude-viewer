// Synthetic sessions for the Sessions tab's stories — never real config, like every other fixture
// here. A real session names a real repo and says what you were doing last Tuesday.
//
// Built by running the real fold over made-up turns rather than by writing session records out by
// hand, the same way the usage fixtures build their report: the day buckets, the totals and the
// grid's shades then agree with each other the way they do in the panel.

import { AgentTool } from '@src/model/types';
import { DEFAULT_RETENTION, Retention } from '@src/model/retention/types';
import { foldToSession, foldTurns } from '@src/model/usage/history/fold';
import { SessionUsage, UsageHistory, UsageTurn } from '@src/model/usage/types';

const DAY_MS: number = 24 * 60 * 60 * 1000;

const TITLES: readonly string[] = [
  'Add the flow view to the skill surface',
  'Contribution grid for the usage view',
  'Fix two agent rows that described a session that was gone',
  'Token estimator as a setting',
  'Memory surface, first pass',
  'Read the context window off the last assistant line',
  'Skill graph neighbourhood layout',
  'Spotlight filters',
  'Copilot session loader',
  'Landing page card glow'
];

// One per session, so a list of them reads the way a real one does: mostly feature branches, with
// `main` on the sessions that never left it.
const BRANCHES: readonly string[] = [
  'main',
  'feat/contribution-grid',
  'feat/skill-flow',
  'fix/agent-row-stale',
  'feat/token-estimator'
];

const CWDS: readonly string[] = [
  '/Users/dev/repos/example-app',
  '/Users/dev/repos/example-app/.claude/worktrees/feat+grid',
  '/Users/dev/repos/other-project'
];

interface SessionArgs {
  index: number;
  daysAgo: number;
  // How many days the session ran across, from `daysAgo` forwards.
  spanDays: number;
  turnsPerDay: number;
  outputPerTurn: number;
  tool?: AgentTool;
  title?: string;
}

// Deterministic ids, so a story re-renders to the same list.
const session = ({
  index,
  daysAgo,
  spanDays,
  turnsPerDay,
  outputPerTurn,
  tool = 'claude',
  title
}: SessionArgs): SessionUsage => {
  const turns: UsageTurn[] = [];

  for (let day = 0; day < spanDays; day += 1) {
    for (let turn = 0; turn < turnsPerDay; turn += 1) {
      // Noon, so a fixture can't land either side of midnight depending on the reader's clock.
      const at: number = new Date(Date.now() - (daysAgo - day) * DAY_MS).setHours(
        12,
        turn % 50,
        0,
        0
      );

      turns.push({
        id: `req_${index}_${day}_${turn}`,
        at,
        tool,
        sessionId: `session-${index}`,
        cwd: CWDS[index % CWDS.length],
        branch: BRANCHES[index % BRANCHES.length],
        source: tool === 'claude' ? 'read' : 'inferred',
        model: tool === 'claude' ? 'claude-opus-5' : 'claude-haiku-4.5',
        tokens: {
          input: 12,
          output: outputPerTurn,
          cacheRead: outputPerTurn * 30,
          cacheWrite5m: 0,
          cacheWrite1h: 0
        }
      });
    }
  }

  const folded: SessionUsage = foldToSession(foldTurns(turns)[0]);
  const name: string | undefined = title ?? TITLES[index % TITLES.length];

  return name ? { ...folded, title: name } : folded;
};

const history = (sessions: SessionUsage[], retention: Retention = DEFAULT_RETENTION): UsageHistory => ({
  sessions: [...sessions].sort((left, right) => right.lastAt - left.lastAt),
  retention,
  scannedAt: Date.now()
});

// Months of work, spread across the year — which is what a real grid looks like, and what makes the
// rank-based shading worth having.
//
// Sessions come in overlapping pairs and threes rather than one to a day. That's what a real week
// is, and it's the only way the Sessions metric shows anything: every day holding exactly one
// session is one distinct value, which correctly paints the whole grid a single shade.
export const busyYear: UsageHistory = history(
  Array.from({ length: 24 }, (_, index) =>
    session({
      index,
      daysAgo: index === 0 ? 0 : Math.floor(index / 2.5) * 27 + (index % 3),
      spanDays: (index % 3) + 1,
      turnsPerDay: 4 + ((index * 7) % 30),
      outputPerTurn: 400 + ((index * 313) % 2_600),
      tool: index % 7 === 0 ? 'copilot' : 'claude'
    })
  )
);

// A machine that's only ever run a handful of sessions, all of them this week.
export const quietHistory: UsageHistory = history([
  session({ index: 0, daysAgo: 0, spanDays: 1, turnsPerDay: 6, outputPerTurn: 1_200 }),
  session({ index: 1, daysAgo: 2, spanDays: 1, turnsPerDay: 3, outputPerTurn: 800 }),
  session({
    index: 2,
    daysAgo: 4,
    spanDays: 1,
    turnsPerDay: 12,
    outputPerTurn: 2_400,
    tool: 'copilot'
  })
]);

// A machine that has only ever run Copilot. Nothing on the wall came out of `~/.claude/projects`,
// so the heading drops the (i): there is no `cleanupPeriodDays` sweep to explain when no square is
// subject to one.
export const copilotOnlyHistory: UsageHistory = history([
  session({ index: 4, daysAgo: 0, spanDays: 1, turnsPerDay: 9, outputPerTurn: 1_100, tool: 'copilot' }),
  session({ index: 5, daysAgo: 1, spanDays: 2, turnsPerDay: 4, outputPerTurn: 700, tool: 'copilot' }),
  session({
    index: 6,
    daysAgo: 5,
    spanDays: 1,
    turnsPerDay: 14,
    outputPerTurn: 2_100,
    tool: 'copilot'
  })
]);

// A day both CLIs worked, which is the case the merged grid exists for: one square, and a tooltip
// that splits it.
export const mixedDayHistory: UsageHistory = history([
  session({ index: 0, daysAgo: 2, spanDays: 1, turnsPerDay: 8, outputPerTurn: 1_400 }),
  session({ index: 1, daysAgo: 2, spanDays: 1, turnsPerDay: 5, outputPerTurn: 900 }),
  session({
    index: 2,
    daysAgo: 2,
    spanDays: 1,
    turnsPerDay: 6,
    outputPerTurn: 1_200,
    tool: 'copilot'
  }),
  session({
    index: 3,
    daysAgo: 0,
    spanDays: 1,
    turnsPerDay: 11,
    outputPerTurn: 1_800,
    tool: 'copilot'
  })
]);

// The scope filter with nothing under it: this workspace has never been worked in.
export const emptyHistory: UsageHistory = history([]);

// A session Claude Code never got round to naming — 4 of the 89 measured on a real machine. The row
// falls back to the folder it ran in.
export const untitledSession: SessionUsage = {
  ...session({ index: 3, daysAgo: 1, spanDays: 1, turnsPerDay: 5, outputPerTurn: 900 }),
  title: undefined
};

export const oneSession: SessionUsage = session({
  index: 1,
  daysAgo: 0,
  spanDays: 1,
  turnsPerDay: 18,
  outputPerTurn: 3_100
});

export const copilotSession: SessionUsage = session({
  index: 8,
  daysAgo: 3,
  spanDays: 2,
  turnsPerDay: 7,
  outputPerTurn: 1_450,
  tool: 'copilot'
});

// A machine where someone set `cleanupPeriodDays` themselves. The grid spans it instead of the
// default, and the card beside the heading names the file it came from rather than saying "default".
export const shortRetention: UsageHistory = history(quietHistory.sessions, {
  days: 7,
  source: 'user',
  path: '/Users/dev/.claude/settings.json'
});

// A session resumed long after it ran, which is the only way history reaches past the retention
// period: touching the file resets its age, so Claude Code's sweep keeps it. The grid has to widen
// to hold it — one lit square months behind an otherwise 30-day window.
export const resumedOldSession: UsageHistory = history([
  ...quietHistory.sessions,
  session({ index: 5, daysAgo: 96, spanDays: 1, turnsPerDay: 9, outputPerTurn: 1_800 })
]);
