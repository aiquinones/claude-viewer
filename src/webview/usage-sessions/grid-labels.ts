// What a square is worth, in words. Its own file because both the readout and the label on every
// square print it, and a grid whose tooltip and whose caption disagree is a grid nobody trusts.

import { plural } from '../format-size';
import { GridDay } from './grid';

// The day a square covers, spelled out. Long forms — the tooltip is a sentence, and it has room.
export const gridDayLabel = (day: GridDay): string =>
  new Date(day.at).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    // A grid can reach back into last year, and "March 3" alone would be ambiguous there.
    year: new Date(day.at).getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
  });

// "No sessions" rather than "0" — a square that says zero reads like a measurement that came back
// empty, where the day simply had nothing in it.
export const gridDayValue = (day: GridDay): string =>
  day.sessions === 0 ? 'No sessions' : plural(day.sessions, 'session');

// What the window heading says. Weeks up to a point, then months — "Last 22 weeks" is a number
// nobody converts in their head, and the grid's own month labels are what carry the precision.
export const spanLabel = (weeks: number): string => {
  if (weeks >= 52) return 'Last year';
  if (weeks > 13) return `Last ${Math.round(weeks / 4.345)} months`;
  return `Last ${plural(weeks, 'week')}`;
};
