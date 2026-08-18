import { useEffect } from 'react';
import { FlowNode } from './steps';

interface UseStepKeysArgs {
  steps: FlowNode[];
  // Which step is open. Nothing is bound while this is undefined — the arrows belong to whatever
  // else is on screen until you've picked a step.
  stepId: string | undefined;
  onFocusStep: (node: FlowNode) => void;
  onClose: () => void;
}

// Once a step is open, ↑ and ↓ walk the sequence and Escape closes it. Bound to the window rather
// than the canvas: opening a step from a card leaves focus on that card, and the card unmounts its
// label into a rail — there's no one element that reliably keeps focus across the move.
export const useStepKeys = ({ steps, stepId, onFocusStep, onClose }: UseStepKeysArgs): void => {
  useEffect(() => {
    if (!stepId) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      // The spotlight is a text box over the panel, and its own arrow keys walk the results.
      if (isTyping(event.target)) return;

      if (event.key === 'Escape') {
        onClose();
        return;
      }

      const step: number = STEP_BY_KEY[event.key];
      if (!step) return;

      const at: number = steps.findIndex((candidate) => candidate.id === stepId);
      const next: FlowNode | undefined = steps[at + step];
      // Stops at both ends rather than wrapping: the sequence has a first step and a last one, and
      // falling off the end into the other end would lose your place in a long flow.
      if (!next) return;

      // Or the pane scrolls under the step that just opened.
      event.preventDefault();
      onFocusStep(next);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [steps, stepId, onFocusStep, onClose]);
};

// How far each key moves. Any other key misses and the handler returns.
const STEP_BY_KEY: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

const isTyping = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};
