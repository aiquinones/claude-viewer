import { MouseEvent } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { TokenEstimator } from '../model/estimate-tokens';
import {
  BUDGET_NOTE,
  EDIT_ESTIMATOR,
  ESTIMATOR_FORMULAS,
  ESTIMATOR_LABELS,
  estimatorNote
} from './estimator-labels';
import { formatTokens } from './format-size';
import { HoverCard, HoverCardTitle } from './HoverCard';
import { useEstimate, useEstimator, useOpenEstimator } from './settings/SettingsContext';

interface TokenEstimateProps {
  // What the host read. The tokens are derived here, so the number moves when the estimator does
  // and nothing has to go back to disk for it.
  chars: number;
  // `~1.2k est. tokens` against a bare `~1.2k`. The long form where there's room for it; the short
  // one in a row that already says what it's counting.
  long?: boolean;
  className?: string;
  // Extra classes on the card, for a pane with its own z-scale.
  cardZClass?: string;
}

// Every "est. tokens" in the panel. One component because the number and the sentence explaining
// which approximation it is have to travel together — a figure you can't interrogate is a figure
// you either trust blindly or ignore.
export const TokenEstimate = ({
  chars,
  long = false,
  className = '',
  cardZClass
}: TokenEstimateProps) => {
  const estimate = useEstimate();
  const estimator: TokenEstimator = useEstimator();
  const openEstimator = useOpenEstimator();

  // The number sits inside rows that are themselves clickable — a prompt file row, a section
  // heading — and opening the dialog must not also select the thing behind it.
  const onEdit = (event: MouseEvent): void => {
    event.stopPropagation();
    openEstimator();
  };

  return (
    <HoverCard
      interactive
      cardZClass={cardZClass}
      className={className}
      card={
        <span onClick={(event: MouseEvent) => event.stopPropagation()}>
          <HoverCardTitle>{ESTIMATOR_LABELS[estimator]}</HoverCardTitle>
          <span className="mono mt-1 block text-foreground">{ESTIMATOR_FORMULAS[estimator]}</span>
          <span className="mt-1 block text-muted-foreground">{estimatorNote(estimator)}</span>
          <span className="mt-1 block text-muted-foreground">{BUDGET_NOTE}</span>
          {/* A plain button rather than the ui/button: this is inline in a `<span>` card, and the
              variant's own layout classes would set a min height the card doesn't want. */}
          <button
            type="button"
            onClick={onEdit}
            className="mt-2 flex cursor-pointer items-center gap-1 rounded-sm text-link hover:underline focus-visible:ring-1 focus-visible:ring-ring"
          >
            <SlidersHorizontal className="size-3.5" />
            {EDIT_ESTIMATOR}
          </button>
        </span>
      }
    >
      {/* The number is the button, not just the card's trigger. The card opens on hover and on
          `:focus-visible`, and `invisible` keeps what's inside it out of the tab order while it's
          shut — so without a press here the CTA would be pointer-only. */}
      <button
        type="button"
        onClick={onEdit}
        title={EDIT_ESTIMATOR}
        className="mono cursor-pointer rounded-sm underline-offset-2 hover:underline focus-visible:ring-1 focus-visible:ring-ring"
      >
        ~{formatTokens(estimate(chars))}
        {long && ' est. tokens'}
      </button>
    </HoverCard>
  );
};
