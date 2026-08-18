import { useCallback, useState } from 'react';
import { FlowNode } from './steps';

export interface FlowFocus {
  // Step first, then each sub-section drilled into. Empty when the flow is showing whole.
  trail: FlowNode[];
  // What the detail pane renders — the end of the trail.
  node: FlowNode | undefined;
  // The step the trail starts at, which is the card that stays marked while you're inside it.
  stepId: string | undefined;
  focusStep: (node: FlowNode) => void;
  drill: (node: FlowNode) => void;
  // Back to a crumb, by its position in the trail.
  goTo: (index: number) => void;
  close: () => void;
}

// Which step is open and how deep into it you've gone. A sub-section is the same shape as a step,
// so drilling in is appending to the trail rather than a second kind of state.
export const useFlowFocus = (): FlowFocus => {
  const [trail, setTrail] = useState<FlowNode[]>([]);

  const focusStep = useCallback((node: FlowNode): void => {
    // Clicking the step you're already inside closes it, which is what makes the card a toggle.
    setTrail((current) => (current[0]?.id === node.id ? [] : [node]));
  }, []);

  const drill = useCallback((node: FlowNode): void => {
    setTrail((current) => [...current, node]);
  }, []);

  const goTo = useCallback((index: number): void => {
    setTrail((current) => current.slice(0, index + 1));
  }, []);

  const close = useCallback((): void => setTrail([]), []);

  return {
    trail,
    node: trail[trail.length - 1],
    stepId: trail[0]?.id,
    focusStep,
    drill,
    goTo,
    close
  };
};
