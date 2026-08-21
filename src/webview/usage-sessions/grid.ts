// Sessions → the squares a contribution grid draws. Pure, and the only place the calendar is
// reasoned about: which day is in which column, what a square is worth, and how dark it gets.

import { dayKey, dayStart, shiftDays } from '../../model/usage/history/day';
import { SessionUsage } from '../../model/usage/types';

// A year of columns, which is the shape everyone already reads a grid like this in. Wider than a
// narrow panel, so the box it sits in scrolls sideways and opens at today.
export const GRID_WEEKS: number = 53;

export const DAYS_PER_WEEK: number = 7;

// Which number a square is painted from. Both are counts of the same days — one asks how much was
// spent, the other how many sessions it took.
//
// Deliberately not annotated: a type here would erase the literals GridMetric derives from.
export const GRID_METRICS = ['tokens', 'sessions'] as const;

export type GridMetric = (typeof GRID_METRICS)[number];

// How many shades a non-empty square can be. Zero is its own state and isn't one of these.
export const GRID_LEVELS: number = 4;

export interface GridDay {
  // Local `YYYY-MM-DD`, matching what the scan bucketed on.
  day: string;
  at: number;
  tokens: number;
  sessions: number;
  // The active metric's number, which is the one the square is painted from.
  value: number;
  // 0 for a day nothing happened, 1–4 otherwise.
  level: number;
  // Past the end of today. The last column runs to Saturday, so up to six of its squares are days
  // that haven't happened — drawn as holes rather than as days that cost nothing.
  future: boolean;
}

export interface GridWeek {
  // The Sunday it starts on, which is also its key.
  key: string;
  days: GridDay[];
  // Printed above the column when the month changes here, the way GitHub's does.
  month?: string;
}

export interface UsageGrid {
  weeks: GridWeek[];
  tokens: number;
  sessions: number;
  // Days with anything on them. The denominator behind "spent on N of the last 371 days".
  activeDays: number;
}

const MONTH_LABEL: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

interface DayTotals {
  tokens: number;
  sessions: number;
}

interface BuildGridArgs {
  sessions: SessionUsage[];
  metric: GridMetric;
  now: number;
}

export const buildGrid = ({ sessions, metric, now }: BuildGridArgs): UsageGrid => {
  const totals: Map<string, DayTotals> = dayTotals(sessions);

  const today: number = dayStart(now);
  // Back to the Sunday of this week, then back a further 52 weeks. Every column is then a whole
  // Sunday-to-Saturday week and today sits in the last one.
  const lastSunday: number = shiftDays({ from: today, days: -new Date(today).getDay() });
  const first: number = shiftDays({ from: lastSunday, days: -(GRID_WEEKS - 1) * DAYS_PER_WEEK });

  // Ranked over the days the grid actually draws, not over everything the scan found. A corpus
  // reaching back further than the span would otherwise set the shades from days nobody can see.
  const thresholds: number[] = levelThresholds({
    totals,
    metric,
    from: dayKey(first),
    to: dayKey(shiftDays({ from: first, days: GRID_WEEKS * DAYS_PER_WEEK - 1 }))
  });

  const weeks: GridWeek[] = [];
  let previousMonth: number | undefined;

  for (let week = 0; week < GRID_WEEKS; week += 1) {
    const start: number = shiftDays({ from: first, days: week * DAYS_PER_WEEK });
    const days: GridDay[] = [];

    for (let offset = 0; offset < DAYS_PER_WEEK; offset += 1) {
      const at: number = shiftDays({ from: start, days: offset });
      const key: string = dayKey(at);
      const held: DayTotals = totals.get(key) ?? { tokens: 0, sessions: 0 };
      const value: number = metric === 'tokens' ? held.tokens : held.sessions;

      days.push({
        day: key,
        at,
        tokens: held.tokens,
        sessions: held.sessions,
        value,
        level: levelOf(value, thresholds),
        future: at > today
      });
    }

    // The label goes on the column whose month differs from the one before it, so a month is named
    // once and above the week it starts in.
    const month: number = new Date(start).getMonth();
    const changed: boolean = previousMonth !== undefined && month !== previousMonth;
    previousMonth = month;

    weeks.push({
      key: dayKey(start),
      days,
      ...(changed ? { month: MONTH_LABEL[month] } : {})
    });
  }

  // Counted off the squares rather than off `totals`, which is every day the scan found. The grid
  // spans 371 days ending this Saturday, so a session from thirteen months ago is in the map and not
  // on the wall — and a caption that counted it would name days nothing is lit for.
  const drawn: GridDay[] = weeks.flatMap((week) => week.days);

  return {
    weeks,
    tokens: drawn.reduce((running, day) => running + day.tokens, 0),
    sessions: drawn.reduce((running, day) => running + day.sessions, 0),
    activeDays: drawn.filter((day) => day.sessions > 0).length
  };
};

// Every day any session spent something, with how many sessions were involved. Only days inside the
// grid's span end up drawn; the rest cost one map entry each and say what the totals under it mean.
const dayTotals = (sessions: SessionUsage[]): Map<string, DayTotals> => {
  const totals: Map<string, DayTotals> = new Map();

  for (const session of sessions) {
    for (const day of session.days) {
      const held: DayTotals | undefined = totals.get(day.day);
      if (held) {
        held.tokens += day.outputTokens;
        held.sessions += 1;
        continue;
      }
      totals.set(day.day, { tokens: day.outputTokens, sessions: 1 });
    }
  }

  return totals;
};

interface LevelThresholdsArgs {
  totals: Map<string, DayTotals>;
  metric: GridMetric;
  // The span, inclusive, as day keys. `YYYY-MM-DD` sorts as a string exactly as it sorts as a date,
  // which is the whole reason the scan buckets on that format.
  from: string;
  to: string;
}

// Quartiles by rank, not by size. One 800k day against a fortnight of 40k ones is normal here, and
// splitting the range evenly would paint that fortnight the palest shade and say nothing about it.
// Ranking is what keeps the four shades carrying roughly a quarter of the days each.
//
// Over the *distinct* values, and returned as thresholds rather than as a rank per day. Both matter
// on the sessions metric, where the numbers are small integers and half the days say 1: ranking days
// would paint two identical days different shades, and quantiles over the raw list would put the
// smallest value above the first threshold, so nothing would ever be level 1.
const levelThresholds = ({ totals, metric, from, to }: LevelThresholdsArgs): number[] => {
  const values: number[] = [...totals.entries()]
    .filter(([day]) => day >= from && day <= to)
    .map(([, day]) => (metric === 'tokens' ? day.tokens : day.sessions))
    .filter((value) => value > 0);

  const distinct: number[] = [...new Set(values)].sort((left, right) => left - right);
  if (distinct.length === 0) return [];

  // The lower bound of each shade above the first. Level 1 needs none — anything non-zero is at
  // least that. One distinct value clamps every threshold onto it, so a machine with a single busy
  // day draws it dark rather than palest.
  return [1, 2, 3].map(
    (step) =>
      distinct[Math.min(Math.ceil((distinct.length * step) / GRID_LEVELS), distinct.length - 1)]
  );
};

const levelOf = (value: number, thresholds: number[]): number => {
  if (value <= 0) return 0;
  return thresholds.reduce((level, threshold) => (value >= threshold ? level + 1 : level), 1);
};

// The day a square covers, spelled out. `title` on every square is what makes the grid readable
// without a hover card per cell, of which there would be 371.
export const gridDayLabel = (day: GridDay): string =>
  new Date(day.at).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: new Date(day.at).getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
  });
