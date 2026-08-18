import { Maximize2 } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { FlowSplit } from './FlowSplit';
import { StepColumn } from './StepColumn';
import { StepDetail } from './StepDetail';
import { CanvasPan, useCanvasPan } from './useCanvasPan';
import { SkillFlow } from './steps';
import { FlowFocus, useFlowFocus } from './useFlowFocus';

interface FlowCanvasProps {
  flow: SkillFlow;
  onOpenSkill: (path: string) => void;
}

// Variant B — the graph's vibe. Dots, the accent glow, drag anywhere to pan, ⌘/ctrl + scroll to
// zoom. The cards are laid out in a column rather than settled by springs: a flow reads top-down
// and its order means something, so `forces.ts` would be reuse for its own sake.
export const FlowCanvas = ({ flow, onOpenSkill }: FlowCanvasProps) => {
  const focus: FlowFocus = useFlowFocus();
  const canvas: CanvasPan = useCanvasPan();
  const stepIndex: number = flow.steps.findIndex((step) => step.id === focus.stepId);

  return (
    <FlowSplit
      focused={Boolean(focus.node)}
      flow={
        <div
          ref={canvas.boxRef}
          onPointerDown={(event) => {
            // A press that lands on a card is a click at it, not a grab of the canvas behind —
            // otherwise dragging from a card pans the view and still fires the button on release.
            if ((event.target as HTMLElement).closest('button')) return;
            canvas.panBackground(event);
          }}
          className="flow-canvas relative h-full cursor-grab overflow-clip"
        >
          <div className="graph-glow pointer-events-none absolute inset-0" />
          <div
            ref={canvas.setDotsElement}
            className="graph-dots pointer-events-none absolute inset-0"
          />

          {/* Full width and anchored at the top, so the transform origin in `useCanvasPan` — top
              centre — is the point the column hangs from. */}
          <div
            ref={canvas.setSurfaceElement}
            className="flow-surface absolute left-0 top-0 w-full px-3 py-5"
          >
            <div className="mx-auto max-w-sm">
              <StepColumn
                steps={flow.steps}
                focusedStepId={focus.stepId}
                compact={false}
                onOpen={focus.focusStep}
              />
            </div>
          </div>

          <span className="pointer-events-none absolute bottom-2 left-3 text-[0.6875rem] text-muted-foreground/70">
            drag to pan · ⌘ or ctrl + scroll to zoom
          </span>
          <div className="absolute bottom-2 right-2">
            <Tooltip label="Reset the view">
              <button
                type="button"
                aria-label="Reset the view"
                onClick={canvas.reset}
                className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground hover:text-foreground"
              >
                <Maximize2 className="size-3" />
              </button>
            </Tooltip>
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
