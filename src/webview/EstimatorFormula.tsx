import { ANTHROPIC_FACTOR, CHARS_PER_TOKEN, TokenEstimator } from '../model/estimate-tokens';
import { Robot } from './loading/Robot';

interface EstimatorFormulaProps {
  estimator: TokenEstimator;
}

// How far the fraction shifts left to make room for the multiplier — half the multiplier's width,
// so the whole expression stays centred in the row either way. A `translate`, not a layout change:
// a row that grows can't be animated, because `width: auto` doesn't interpolate.
const MULTIPLIER_WIDTH: string = 'w-20';
const SHIFT_HOME: string = 'translate-x-10';

// The estimator, drawn. A fraction because that's what the formula is — the text Claude reads over
// the characters-per-token it reads it at — and the multiplier slides in beside it when the
// Anthropic adjustment is the one selected.
//
// `transition-[translate]`, not `transition-transform`: Tailwind v4's `translate-x-*` writes the
// `translate` property, and naming `transform` here animates nothing at all.
export const EstimatorFormula = ({ estimator }: EstimatorFormulaProps) => {
  const adjusted: boolean = estimator === 'anthropic';

  return (
    <div
      aria-hidden
      className="flex items-center justify-center overflow-clip rounded-lg border border-border bg-muted px-4 py-6"
    >
      <div
        className={`flex items-center gap-3 transition-[translate] duration-300 ease-out ${
          adjusted ? 'translate-x-0' : SHIFT_HOME
        }`}
      >
        {/* The numerator is what gets counted: everything the robot reads. */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 px-3 pb-1.5">
            {/* No color class: `.robot` paints its own, so its outline's seams don't stack alpha. */}
            <Robot className="size-7" />
            <span className="text-sm text-foreground">chars</span>
          </div>
          <span className="h-px w-full bg-foreground" />
          <span className="mono pt-1.5 text-sm text-foreground">{CHARS_PER_TOKEN}</span>
        </div>

        {/* Present in the layout whichever estimator is picked, so the shift above is the only
            thing that moves. Fading a fixed-width box is what keeps the motion to one property. */}
        <span
          className={`mono ${MULTIPLIER_WIDTH} shrink-0 text-sm text-foreground transition-opacity duration-300 ease-out ${
            adjusted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          × {ANTHROPIC_FACTOR}
        </span>
      </div>
    </div>
  );
};
