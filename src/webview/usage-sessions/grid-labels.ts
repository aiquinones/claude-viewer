// What a square is worth, in words. Its own file because both the readout and the label on every
// square print it, and a grid whose tooltip and whose caption disagree is a grid nobody trusts.

import { AGENT_TOOLS, AGENT_TOOL_SHORT_LABEL } from '../../model/types';
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
//
// A lit day names the CLIs behind it: "3 sessions (2 Claude, 1 ghcp)". The square itself is one
// shade whatever the mix, so the split has nowhere else to be said — and a day only one tool worked
// still gets the parenthetical, since which tool it was is the whole question on a lone square.
export const gridDayValue = (day: GridDay): string =>
  day.sessions === 0 ? 'No sessions' : `${plural(day.sessions, 'session')} (${toolSplit(day)})`;

// Only the tools that were there. A zero in the list would read as a CLI that ran and cost nothing.
const toolSplit = (day: GridDay): string =>
  AGENT_TOOLS.filter((tool) => day.byTool[tool] > 0)
    .map((tool) => `${day.byTool[tool]} ${AGENT_TOOL_SHORT_LABEL[tool]}`)
    .join(', ');

// What the window heading says. Weeks up to a point, then months — "Last 22 weeks" is a number
// nobody converts in their head, and the grid's own month labels are what carry the precision.
export const spanLabel = (weeks: number): string => {
  if (weeks >= 52) return 'Last year';
  if (weeks > 13) return `Last ${Math.round(weeks / 4.345)} months`;
  return `Last ${plural(weeks, 'week')}`;
};
