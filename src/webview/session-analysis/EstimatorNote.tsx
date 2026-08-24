import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { TokenEstimator } from '../../model/estimate-tokens';
import { ESTIMATOR_LABELS } from '../estimator-labels';
import { HoverCard, HoverCardBody, HoverCardTitle } from '../HoverCard';

interface EstimatorNoteProps {
  // What the session would be measured with, and why.
  session: TokenEstimator;
  reason: string;
  // What the setting says, which is the thing overriding it.
  setting: TokenEstimator;
  // Whether the override is still in force. False means this view is already using the session's.
  overridden: boolean;
  onUseSession: () => void;
  children: ReactNode;
}

// Why this size is the size it is, where the setting and the session disagree. Nothing renders this
// when they agree — a card that opens to say "these two match" is a card that trains you to stop
// opening cards.
//
// The button writes nothing. `claudeViewer.tokens.estimator` is a preference about every number in
// the panel, and one session's page is not the place to change it — so this is `useState` in the
// view, and leaving the page puts it back.
export const EstimatorNote = ({
  session,
  reason,
  setting,
  overridden,
  onUseSession,
  children
}: EstimatorNoteProps) => (
  <HoverCard
    interactive
    card={
      <>
        <HoverCardTitle>Estimator override</HoverCardTitle>
        <HoverCardBody>
          {reason} That would be the {ESTIMATOR_LABELS[session]} estimator, and your setting says{' '}
          {ESTIMATOR_LABELS[setting]}.{' '}
          {overridden
            ? 'These sizes use your setting.'
            : 'These sizes use the session’s, for this page only.'}
        </HoverCardBody>
        {overridden && (
          <Button
            variant="link"
            size="sm"
            className="mt-1 h-auto p-0 text-xs"
            onClick={onUseSession}
          >
            Use this session’s estimator
          </Button>
        )}
      </>
    }
  >
    {children}
  </HoverCard>
);
