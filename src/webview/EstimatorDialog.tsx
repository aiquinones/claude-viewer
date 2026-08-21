import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { TOKEN_ESTIMATORS, TokenEstimator } from '../model/estimate-tokens';
import { Button } from '@/components/ui/button';
import { EstimatorFormula } from './EstimatorFormula';
import {
  ESTIMATOR_CAVEAT,
  ESTIMATOR_FORMULAS,
  ESTIMATOR_HINTS,
  ESTIMATOR_LABELS
} from './estimator-labels';

interface EstimatorDialogProps {
  // What's set today. Seeds the draft, and what Apply is measured against.
  current: TokenEstimator;
  onApply: (estimator: TokenEstimator) => void;
  onDismiss: () => void;
}

// Picking which approximation every "est. tokens" in the panel means.
//
// It holds a draft: the radios move the picture, and nothing is written until Apply. That's the
// difference from the usage toggles, which write on the press — a usage toggle changes which number
// you're reading on the surface behind it, and this changes every number in the panel. Closing on
// `x`, Escape or the backdrop discards the draft, so the dialog is somewhere to compare the two
// formulas without committing to either.
export const EstimatorDialog = ({ current, onApply, onDismiss }: EstimatorDialogProps) => {
  const [draft, setDraft] = useState<TokenEstimator>(current);
  const unchanged: boolean = draft === current;
  const box = useRef<HTMLDivElement>(null);

  // On the window rather than on the box: the box is focusable but nothing inside it is focused on
  // open, so a listener there would only fire once you had clicked something. Escape closes, and the
  // arrows walk the options — both directions on both axes, since the radios read as a list and the
  // formula beside them reads as a row.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        return onDismiss();
      }

      const step: number | undefined = ARROW_STEPS[event.key];
      if (step === undefined) return;

      event.preventDefault();
      setDraft((previous) => stepEstimator({ from: previous, step }));
    };

    box.current?.focus();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-scrim px-4 pt-[15vh]"
      onMouseDown={onDismiss}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        className="flat-focus flex h-fit w-full max-w-md flex-col overflow-clip rounded-xl border border-border bg-popover shadow-2xl outline-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start gap-3 border-b border-border px-4 py-3">
          <div className="mr-auto flex flex-col gap-1">
            <h2 id={TITLE_ID} className="text-sm font-semibold">
              Token estimator
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{ESTIMATOR_CAVEAT}</p>
          </div>
          <Button variant="ghost" size="icon" title="Close" onClick={onDismiss}>
            <X />
          </Button>
        </header>

        {/* `px-4` and `gap-2` rather than a tighter `p-2`: the options and the formula under them
            are one column, so they share an inset, and two cards touching read as one control. */}
        <div
          role="radiogroup"
          aria-labelledby={TITLE_ID}
          className="flex flex-col gap-2 px-4 py-3"
        >
          {TOKEN_ESTIMATORS.map((estimator) => (
            <EstimatorOption
              key={estimator}
              estimator={estimator}
              selected={estimator === draft}
              onSelect={setDraft}
            />
          ))}
        </div>

        <div className="px-4 pb-4">
          <EstimatorFormula estimator={draft} />
        </div>

        {/* Disabled while the draft is what's already set, so the button says whether pressing it
            would do anything rather than only doing nothing. */}
        <footer className="flex justify-end border-t border-border px-4 py-3">
          {/* Grey rather than a faded blue: the shared `disabled:opacity-50` on a primary button
              still reads as the accent, and this one is off most of the time it's on screen. A
              `disabled:` variant carries a pseudo-class, so it outranks the base `bg-primary`
              whichever order Tailwind emitted them in. */}
          <Button
            size="sm"
            disabled={unchanged}
            onClick={() => onApply(draft)}
            className="disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          >
            Apply
          </Button>
        </footer>
      </div>
    </div>
  );
};

const TITLE_ID: string = 'estimator-dialog-title';

// Which way each arrow moves through TOKEN_ESTIMATORS.
const ARROW_STEPS: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1
};

interface StepEstimatorArgs {
  from: TokenEstimator;
  step: number;
}

// Clamped rather than wrapping: with two options a wrap makes both arrows do the same thing, and
// an arrow that reverses direction at the end of a list is harder to hold down than one that stops.
const stepEstimator = ({ from, step }: StepEstimatorArgs): TokenEstimator => {
  const next: number = TOKEN_ESTIMATORS.indexOf(from) + step;
  return TOKEN_ESTIMATORS[Math.min(Math.max(next, 0), TOKEN_ESTIMATORS.length - 1)];
};

interface EstimatorOptionProps {
  estimator: TokenEstimator;
  selected: boolean;
  onSelect: (estimator: TokenEstimator) => void;
}

// One radio: the circle, the name, the formula, and what picking it claims.
const EstimatorOption = ({ estimator, selected, onSelect }: EstimatorOptionProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={() => onSelect(estimator)}
    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
      selected ? 'border-border bg-accent' : 'border-transparent hover:bg-accent'
    }`}
  >
    <span
      className={`flex size-4 shrink-0 items-center justify-center self-center rounded-full border transition-colors ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <span
        className={`size-2 rounded-full bg-primary transition-transform ${
          selected ? 'scale-100' : 'scale-0'
        }`}
      />
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-baseline gap-2 text-sm font-medium">
        {ESTIMATOR_LABELS[estimator]}
        <span className="mono text-xs font-normal text-muted-foreground">
          {ESTIMATOR_FORMULAS[estimator]}
        </span>
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">
        {ESTIMATOR_HINTS[estimator]}
      </span>
    </span>
  </button>
);
