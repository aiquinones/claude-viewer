import { Maximize2 } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { useCursorGlow } from '../glow/useCursorGlow';
import { FlowSplit } from './FlowSplit';
import { StepColumn } from './StepColumn';
import { StepDetail } from './StepDetail';
import { CanvasZoom, useCanvasZoom } from './useCanvasZoom';
import { SkillFlow } from './steps';
import { FlowFocus, useFlowFocus } from './useFlowFocus';
import { useStepKeys } from './useStepKeys';

interface FlowCanvasProps {
  flow: SkillFlow;
  onOpenSkill: (path: string) => void;
}

// The steps a SKILL.md lays out, on a lit canvas. Clicking one shrinks the column to a rail and
// opens the step beside it; ↑ and ↓ then walk the sequence and Escape closes it.
//
// There is no dragging. A flow is a column and its order is fixed, so panning only ever did what
// scrolling already does — what's left of the canvas is the light, the dots, and the zoom.
export const FlowCanvas = ({ flow, onOpenSkill }: FlowCanvasProps) => {
  const focus: FlowFocus = useFlowFocus();
  // The glow owns the box's ref, since it's the one reading pointer moves off it.
  const { cardRef, glowRef } = useCursorGlow<HTMLDivElement>();
  const zoom: CanvasZoom = useCanvasZoom({ boxRef: cardRef });
  const stepIndex: number = flow.steps.findIndex((step) => step.id === focus.stepId);

  useStepKeys({
    steps: flow.steps,
    stepId: focus.stepId,
    onFocusStep: focus.focusStep,
    onClose: focus.close
  });

  return (
    <FlowSplit
      focused={Boolean(focus.node)}
      flow={
        <div ref={cardRef} className="flow-canvas relative h-full overflow-clip">
          {/* Behind the scroller, so the light stays put while the steps move past it. Placed by
              margins rather than a -translate utility: `translate` is what the spring writes, and
              Tailwind v4's translate-x-* would be writing the same property. */}
          <div
            ref={glowRef}
            aria-hidden
            className="flow-glow pointer-events-none absolute left-1/2 top-1/2 -ml-48 -mt-48 size-96"
          />
          <div aria-hidden className="graph-dots pointer-events-none absolute inset-0" />

          {/* Zoom rather than scale: it reflows, so a zoomed-in flow is genuinely taller and this
              pane scrolls to the rest of it. */}
          <div className="relative h-full overflow-y-auto overflow-x-clip px-3 py-5">
            <div style={{ zoom: zoom.zoom }}>
              <StepColumn
                steps={flow.steps}
                focusedStepId={focus.stepId}
                compact={false}
                onOpen={focus.focusStep}
              />
            </div>
          </div>

          <span className="pointer-events-none absolute bottom-2 left-3 text-[0.6875rem] text-muted-foreground/70">
            {focus.node ? '↑ ↓ to walk the steps · esc to close' : '⌘ or ctrl + scroll to zoom'}
          </span>
          {zoom.zoom !== 1 && (
            <div className="absolute bottom-2 right-2">
              <Tooltip label="Reset the zoom">
                <button
                  type="button"
                  aria-label="Reset the zoom"
                  onClick={zoom.reset}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground hover:text-foreground"
                >
                  <Maximize2 className="size-3" />
                </button>
              </Tooltip>
            </div>
          )}
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
