import { FlowSplit } from './FlowSplit';
import { StepColumn } from './StepColumn';
import { StepDetail } from './StepDetail';
import { SkillFlow } from './steps';
import { useFlowFocus, FlowFocus } from './useFlowFocus';

interface FlowColumnProps {
  flow: SkillFlow;
  onOpenSkill: (path: string) => void;
}

// Variant A — the document. A plain vertical stack that scrolls, no canvas and nothing to pan.
// Clicking a step shrinks the stack to a rail and opens the step beside it.
//
// The cheapest of the three, and the only one that still works in a narrow panel.
export const FlowColumn = ({ flow, onOpenSkill }: FlowColumnProps) => {
  const focus: FlowFocus = useFlowFocus();
  const stepIndex: number = flow.steps.findIndex((step) => step.id === focus.stepId);

  return (
    <FlowSplit
      focused={Boolean(focus.node)}
      flow={
        <div className="h-full overflow-y-auto overflow-x-clip px-3 py-4">
          <div className={focus.node ? '' : 'mx-auto max-w-sm'}>
            <StepColumn
              steps={flow.steps}
              focusedStepId={focus.stepId}
              compact={Boolean(focus.node)}
              onOpen={focus.focusStep}
            />
          </div>
        </div>
      }
      detail={
        focus.node && (
          <StepDetail
            trail={focus.trail}
            stepIndex={stepIndex}
            onGoTo={focus.goTo}
            onDrill={focus.drill}
            onClose={focus.close}
            onOpenSkill={onOpenSkill}
          />
        )
      }
    />
  );
};
