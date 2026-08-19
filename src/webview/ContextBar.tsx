import { ContextReading } from '../model/sessions/context';
import { BudgetLevel } from '../model/settings/budget';
import { formatContextTokens } from './format-size';

interface ContextBarProps {
  reading: ContextReading;
}

// The same three colours `BudgetBar` paints, and for the same reason: it's the same claim about a
// measured number, so it should read identically. `within` stays muted — colour only where it means
// something.
const FILL: Record<BudgetLevel, string> = {
  within: 'bg-muted-foreground',
  near: 'bg-warn',
  over: 'bg-error'
};

// How full the model's context is. Two things are drawn here and they measure different things: the
// fill is how much of the window is used, the colour is whether the conversation has grown big
// enough to go wrong. Those come apart — 200k in a 1M window is a fifth of a bar painted yellow —
// so the thresholds are marked on the track. The colour then changes where a tick is, and the
// picture explains itself before the card has to.
export const ContextBar = ({ reading }: ContextBarProps) => (
  <div
    role="meter"
    aria-valuemin={0}
    aria-valuemax={reading.window.tokens}
    aria-valuenow={reading.tokens}
    aria-label={`context ${formatContextTokens(reading.tokens)} of ${formatContextTokens(
      reading.window.tokens
    )}`}
    className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
  >
    {/* Clamped, so a session past its assumed window reads as a full bar rather than one running
        off the end. That it *is* past is said in the card, where there's room to say why. */}
    <div
      className={`h-full rounded-full ${FILL[reading.level]}`}
      style={{ width: `${Math.min(reading.fraction, 1) * 100}%` }}
    />
    <Tick tokens={reading.warnAt} window={reading.window.tokens} />
    <Tick tokens={reading.errorAt} window={reading.window.tokens} />
  </div>
);

interface TickProps {
  tokens: number;
  window: number;
}

// Where a threshold falls on the track. Painted in the panel background rather than a border colour:
// it has to be legible against the track on one side and the fill on the other, and the fill is one
// of three colours.
//
// A threshold of 0 is off, and one at or past the window has nothing to mark — the bar would be
// full before it mattered.
const Tick = ({ tokens, window }: TickProps) => {
  if (tokens <= 0 || tokens >= window) return null;

  return (
    <span
      aria-hidden
      className="absolute inset-y-0 w-px bg-background"
      style={{ left: `${(tokens / window) * 100}%` }}
    />
  );
};
