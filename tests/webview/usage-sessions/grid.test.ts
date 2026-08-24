import { describe, expect, it } from 'vitest';
import { AgentTool } from '@src/model/types';
import { SessionUsage } from '@src/model/usage/types';
import { GridDay, UsageGrid, buildGrid } from '@src/webview/usage-sessions/grid';
import { gridDayValue } from '@src/webview/usage-sessions/grid-labels';

// Noon on a fixed date, so a day bucket can't land either side of midnight depending on when the
// suite runs. The grid works in local calendar days, which is what the scan bucketed on.
const NOW: number = new Date(2026, 7, 20, 12).getTime();

const DAY_MS: number = 24 * 60 * 60 * 1000;

const dayKeyOf = (daysAgo: number): string => {
  const at: Date = new Date(NOW - daysAgo * DAY_MS);
  const month: string = String(at.getMonth() + 1).padStart(2, '0');
  const day: string = String(at.getDate()).padStart(2, '0');
  return `${at.getFullYear()}-${month}-${day}`;
};

interface SessionArgs {
  id: string;
  tool: AgentTool;
  // Which days it was active on, counted back from NOW.
  daysAgo: number[];
}

// Only the fields buildGrid reads carry anything — it counts sessions per day and never looks at
// what one spent.
const session = ({ id, tool, daysAgo }: SessionArgs): SessionUsage => ({
  sessionId: id,
  tool,
  cwd: '/repo',
  firstAt: NOW - Math.max(...daysAgo) * DAY_MS,
  lastAt: NOW - Math.min(...daysAgo) * DAY_MS,
  outputTokens: 100,
  turns: 4,
  days: [...daysAgo]
    .sort((left, right) => right - left)
    .map((ago) => ({ day: dayKeyOf(ago), outputTokens: 100, turns: 4 }))
});

const dayOf = (grid: UsageGrid, daysAgo: number): GridDay => {
  const key: string = dayKeyOf(daysAgo);
  const found: GridDay | undefined = grid.weeks
    .flatMap((week) => week.days)
    .find((day) => day.day === key);

  if (!found) throw new Error(`${key} is not on the grid`);
  return found;
};

const gridOf = (sessions: SessionUsage[]): UsageGrid =>
  buildGrid({ sessions, now: NOW, retentionDays: 30 });

describe('buildGrid, over both CLIs at once', () => {
  it('splits a day two tools worked, and totals it', () => {
    const grid: UsageGrid = gridOf([
      session({ id: 'a', tool: 'claude', daysAgo: [2] }),
      session({ id: 'b', tool: 'claude', daysAgo: [2] }),
      session({ id: 'c', tool: 'copilot', daysAgo: [2] })
    ]);

    const day: GridDay = dayOf(grid, 2);

    expect(day.sessions).toBe(3);
    expect(day.byTool).toEqual({ claude: 2, copilot: 1 });
  });

  it('counts a session on every day it was active', () => {
    const grid: UsageGrid = gridOf([session({ id: 'a', tool: 'copilot', daysAgo: [0, 1, 2] })]);

    expect(dayOf(grid, 0).byTool).toEqual({ claude: 0, copilot: 1 });
    expect(dayOf(grid, 1).byTool).toEqual({ claude: 0, copilot: 1 });
    expect(grid.byTool).toEqual({ claude: 0, copilot: 3 });
  });

  it('shades a square from the total rather than from either tool', () => {
    const grid: UsageGrid = gridOf([
      session({ id: 'a', tool: 'claude', daysAgo: [1] }),
      session({ id: 'b', tool: 'copilot', daysAgo: [1] }),
      session({ id: 'c', tool: 'copilot', daysAgo: [3] })
    ]);

    // Two sessions against one is the top of the range here, so the mixed day is the darker square
    // even though neither tool contributed more than the lone Copilot day did.
    expect(dayOf(grid, 1).level).toBeGreaterThan(dayOf(grid, 3).level);
  });

  it('reports no Claude reach on a machine that has only run Copilot', () => {
    const grid: UsageGrid = gridOf([session({ id: 'a', tool: 'copilot', daysAgo: [40] })]);

    // 40 days is past the 30-day sweep, which on a Claude square would be the card's evidence of a
    // resumed session. Copilot is subject to no sweep, so it proves nothing and isn't counted.
    expect(grid.oldestClaudeDays).toBeUndefined();
    expect(grid.byTool.claude).toBe(0);
  });

  it('measures Claude reach from Claude squares, not from the oldest lit one', () => {
    const grid: UsageGrid = gridOf([
      session({ id: 'a', tool: 'copilot', daysAgo: [40] }),
      session({ id: 'b', tool: 'claude', daysAgo: [5] })
    ]);

    expect(grid.oldestClaudeDays).toBe(5);
  });

  it('leaves every tool at zero where nothing ran', () => {
    const grid: UsageGrid = gridOf([]);

    expect(grid.sessions).toBe(0);
    expect(grid.byTool).toEqual({ claude: 0, copilot: 0 });
    expect(grid.activeDays).toBe(0);
    expect(grid.oldestClaudeDays).toBeUndefined();
  });
});

describe('gridDayValue', () => {
  it('names the tools behind a mixed square', () => {
    const grid: UsageGrid = gridOf([
      session({ id: 'a', tool: 'claude', daysAgo: [2] }),
      session({ id: 'b', tool: 'claude', daysAgo: [2] }),
      session({ id: 'c', tool: 'copilot', daysAgo: [2] })
    ]);

    expect(gridDayValue(dayOf(grid, 2))).toBe('3 sessions (2 Claude, 1 ghcp)');
  });

  // A lone square still says which CLI it was — that's the question a merged grid raises.
  it('names the one tool on a single-tool square', () => {
    const grid: UsageGrid = gridOf([session({ id: 'a', tool: 'copilot', daysAgo: [1] })]);

    expect(gridDayValue(dayOf(grid, 1))).toBe('1 session (1 ghcp)');
  });

  it('says nothing about tools on an empty day', () => {
    const grid: UsageGrid = gridOf([session({ id: 'a', tool: 'claude', daysAgo: [1] })]);

    expect(gridDayValue(dayOf(grid, 3))).toBe('No sessions');
  });
});
