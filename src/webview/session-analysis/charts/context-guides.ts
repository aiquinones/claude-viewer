// The horizontal rules on the context chart, and how high the chart has to reach to show them.
// Pure, and built out of the same `ContextReading` the agent row's bar draws — so the two surfaces
// can't disagree about where a threshold is or what colour it makes things.

import { ContextReading } from '../../../model/sessions/context';
import { BudgetLevel } from '../../../model/settings/budget';
import { CONTEXT_LABELS } from '../../agent-context-labels';
import { formatContextTokens } from '../../format-size';

// One rule across the plot. `level` is the colour it paints in, which is the level a session sitting
// on that line would be at.
export interface ChartGuide {
  value: number;
  label: string;
  level: BudgetLevel;
}

// How much headroom the chart leaves above whichever of the peak and the warn line is higher. Enough
// that a session parked exactly on a threshold doesn't draw its line along the top edge.
const HEADROOM: number = 1.08;

interface ContextMaxArgs {
  reading: ContextReading;
  peak: number;
}

// What the top of the context chart means.
//
// Not the window: a 50k session in a 1M window would be a flat line along the floor with both
// thresholds off in the empty space above it. Not the peak either, or a short session would show no
// warn line at all — and the line is half of what was asked for. So it's whichever of the two is
// higher, plus headroom, and never past the window, which is the one number the session genuinely
// cannot exceed without the table being wrong.
export const contextMax = ({ reading, peak }: ContextMaxArgs): number => {
  const wanted: number = Math.max(peak, reading.warnAt) * HEADROOM;
  return Math.round(Math.max(peak, Math.min(wanted, reading.window.tokens)));
};

interface ContextGuidesArgs {
  reading: ContextReading;
  max: number;
}

// Both thresholds, dropping the ones with nothing to draw: a threshold of 0 is off, and one above
// the top of the chart has no line to sit on. The error line arrives on its own as a session grows
// into it, which is the point at which it starts meaning something.
export const contextGuides = ({ reading, max }: ContextGuidesArgs): ChartGuide[] =>
  [
    { value: reading.warnAt, label: CONTEXT_LABELS.warnAt, level: 'near' as BudgetLevel },
    { value: reading.errorAt, label: CONTEXT_LABELS.errorAt, level: 'over' as BudgetLevel }
  ]
    .filter((guide) => guide.value > 0 && guide.value <= max)
    .map((guide) => ({ ...guide, label: `${guide.label} ${formatContextTokens(guide.value)}` }));
