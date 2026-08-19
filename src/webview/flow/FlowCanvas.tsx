import { useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { useCursorGlow } from '../glow/useCursorGlow';
import { SectionTarget } from '../markdown/find-section';
import { trailTo } from './find-step';
import { FlowSplit } from './FlowSplit';
import { StepColumn } from './StepColumn';
import { StepDetail } from './StepDetail';
import { CanvasZoom, useCanvasZoom } from './useCanvasZoom';
import { FlowNode, SkillFlow } from './steps';
import { FlowFocus, useFlowFocus } from './useFlowFocus';
import { useStepKeys } from './useStepKeys';

interface FlowCanvasProps {
  flow: SkillFlow;
  // A heading a vscode:// link named. When it's a step — or a section inside one — the flow opens
  // on it; when it isn't, SkillView never picks this mode in the first place.
  target?: SectionTarget;
  onOpenSkill: (path: string) => void;
}

// The steps a SKILL.md lays out, on a lit canvas. Clicking one shrinks the column to a rail and
// opens the step beside it; ↑ and ↓ then walk the sequence and Escape closes it.
//
// There is no dragging. A flow is a column and its order is fixed, so panning only ever did what
// scrolling already does — what's left of the canvas is the light, the dots, and the zoom.
//
// Nothing here scrolls: the canvas is as tall as its steps and the panel is the scroll container,
// which is also what makes `zoom` do something — it reflows, so zooming in genuinely lengthens the
// page. `min-h-72` is the floor, and it lives here rather than on the split because this is what
// paints the ground under it.
export const FlowCanvas = ({ flow, target, onOpenSkill }: FlowCanvasProps) => {
  const focus: FlowFocus = useFlowFocus();
  // The glow owns the box's ref, since it's the one reading pointer moves off it.
  const { cardRef, glowRef } = useCursorGlow<HTMLDivElement>();
  const zoom: CanvasZoom = useCanvasZoom({ boxRef: cardRef });
  const stepIndex: number = flow.steps.findIndex((step) => step.id === focus.stepId);

  // Keyed on the nonce, so the same link twice re-opens the step you closed. Nothing clears it
  // afterwards — an opened step stays open until you close it, the same as one you clicked.
  const open = focus.open;
  useEffect(() => {
    if (!target) return;

    const trail: FlowNode[] | undefined = trailTo({ steps: flow.steps, slug: target.slug });
    if (trail) open(trail);
  }, [target?.slug, target?.nonce, flow, open]);

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
        <div ref={cardRef} className="flow-canvas relative flex min-h-72 flex-col overflow-clip">
          {/* The ground follows the viewport rather than the box. Both layers are sized in `vh`
              off a zero-height sticky line, because a box as tall as its flow would otherwise put
              the light half a column down, and `graph-dots` masks itself with a circle at its own
              centre — on a tall box the dots would exist only in a band across the middle.
              The light is placed by margins rather than a -translate utility: `translate` is what
              the spring writes, and Tailwind v4's translate-x-* would write the same property. */}
          <div aria-hidden className="pointer-events-none sticky top-0 z-0 h-0">
            <div
              ref={glowRef}
              className="flow-glow absolute left-1/2 top-[50vh] -ml-48 -mt-48 size-96"
            />
            <div className="graph-dots absolute inset-x-0 top-0 h-screen" />
          </div>

          <div className="relative flex-1 px-3 py-5">
            <div style={{ zoom: zoom.zoom }}>
              <StepColumn
                steps={flow.steps}
                focusedStepId={focus.stepId}
                compact={false}
                onOpen={focus.focusStep}
              />
            </div>
          </div>

          {/* Sticky rather than pinned to the box's bottom corner, which on a page-tall flow is off
              screen almost always. It only sticks because every ancestor clips rather than hides —
              `overflow: hidden` is a scroll container and would capture it. */}
          <div className="pointer-events-none sticky bottom-0 z-10 flex items-end justify-between gap-2 px-3 pb-2">
            <span className="text-[0.6875rem] text-muted-foreground/70">
              {focus.node ? '↑ ↓ to walk the steps · esc to close' : '⌘ or ctrl + scroll to zoom'}
            </span>
            {zoom.zoom !== 1 && (
              <Tooltip label="Reset the zoom">
                <button
                  type="button"
                  aria-label="Reset the zoom"
                  onClick={zoom.reset}
                  className="pointer-events-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground hover:text-foreground"
                >
                  <Maximize2 className="size-3" />
                </button>
              </Tooltip>
            )}
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
