import { Fragment } from 'react';
import { StepCard, StepState } from './StepCard';
import { StepConnector } from './StepConnector';
import { FlowNode } from './steps';

interface StepColumnProps {
  steps: FlowNode[];
  // The step the detail pane is showing, if any. Everything else fades while one is open.
  focusedStepId: string | undefined;
  // The rail the column shrinks to once a step is open.
  compact: boolean;
  onOpen: (node: FlowNode) => void;
}

// The sequence itself: cards top to bottom with an arrow between each. Variant A puts this in a
// scroll container, variant B puts it on a canvas that pans — the picture is the same one.
export const StepColumn = ({ steps, focusedStepId, compact, onOpen }: StepColumnProps) => (
  <ol className="flex list-none flex-col items-center">
    {steps.map((step, index) => (
      <Fragment key={step.id}>
        {index > 0 && (
          <StepConnector active={joins({ steps, index, focusedStepId })} />
        )}
        <li className="flex w-full justify-center">
          <StepCard
            node={step}
            index={index}
            state={cardState({ id: step.id, focusedStepId })}
            compact={compact}
            onOpen={() => onOpen(step)}
          />
        </li>
      </Fragment>
    ))}
  </ol>
);

interface CardStateArgs {
  id: string;
  focusedStepId: string | undefined;
}

const cardState = ({ id, focusedStepId }: CardStateArgs): StepState => {
  if (!focusedStepId) return 'plain';
  return id === focusedStepId ? 'active' : 'faded';
};

interface JoinsArgs {
  steps: FlowNode[];
  index: number;
  focusedStepId: string | undefined;
}

// A connector is lit when it touches the open step, so the path in and out of it reads as a path.
const joins = ({ steps, index, focusedStepId }: JoinsArgs): boolean =>
  Boolean(focusedStepId) &&
  (steps[index].id === focusedStepId || steps[index - 1].id === focusedStepId);
