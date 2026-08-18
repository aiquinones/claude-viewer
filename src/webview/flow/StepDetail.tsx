import { ChevronRight, X } from 'lucide-react';
import { plural } from '../format-size';
import { Blocks } from '../markdown/Blocks';
import { SkillChip } from './SkillChip';
import { FlowNode } from './steps';

interface StepDetailProps {
  // Step first, then every sub-section drilled into. Never empty — the pane isn't rendered
  // without one.
  trail: FlowNode[];
  // Where the step sits in the sequence, for the badge on the title.
  stepIndex: number;
  onGoTo: (index: number) => void;
  onDrill: (node: FlowNode) => void;
  onClose: () => void;
  onOpenSkill: (path: string) => void;
}

// One node of the flow, opened. A sub-section is the same shape as a step, so drilling in renders
// this same component one level down rather than a second pane that nearly agrees with it.
export const StepDetail = ({
  trail,
  stepIndex,
  onGoTo,
  onDrill,
  onClose,
  onOpenSkill
}: StepDetailProps) => {
  const node: FlowNode | undefined = trail[trail.length - 1];
  if (!node) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-start gap-2 border-b border-border px-3 py-2">
        <Trail trail={trail} stepIndex={stepIndex} onGoTo={onGoTo} />
        <button
          type="button"
          aria-label="Close the step"
          onClick={onClose}
          className="ml-auto shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip px-3 py-3">
        <h3 className="text-sm font-semibold">{node.label}</h3>

        {node.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {node.skills.map((reference) => (
              <SkillChip
                key={reference.skill.path}
                reference={reference}
                onOpenSkill={onOpenSkill}
              />
            ))}
          </div>
        )}

        <div className="mt-2 text-sm leading-relaxed">
          {node.blocks.length > 0 ? (
            <Blocks tokens={node.blocks} />
          ) : (
            <p className="text-xs italic text-muted-foreground">
              nothing written directly under this heading
            </p>
          )}
        </div>

        {node.children.length > 0 && <SubSections node={node} onDrill={onDrill} />}
      </div>
    </div>
  );
};

interface TrailProps {
  trail: FlowNode[];
  stepIndex: number;
  onGoTo: (index: number) => void;
}

// The way back up. The last crumb is where you are, so it isn't a button.
const Trail = ({ trail, stepIndex, onGoTo }: TrailProps) => (
  <nav aria-label="Step trail" className="flex min-w-0 flex-wrap items-center gap-0.5 text-xs">
    <span className="step-badge mono mr-1 flex size-4 shrink-0 items-center justify-center rounded text-[0.5625rem] font-semibold">
      {stepIndex + 1}
    </span>
    {trail.map((crumb, index) => {
      const last: boolean = index === trail.length - 1;

      return (
        <span key={crumb.id} className="flex min-w-0 items-center gap-0.5">
          {index > 0 && <ChevronRight className="size-3 shrink-0 text-muted-foreground" />}
          {last ? (
            <span className="truncate font-medium text-foreground">{crumb.label}</span>
          ) : (
            <button
              type="button"
              onClick={() => onGoTo(index)}
              className="cursor-pointer truncate text-muted-foreground hover:text-foreground hover:underline"
            >
              {crumb.label}
            </button>
          )}
        </span>
      );
    })}
  </nav>
);

interface SubSectionsProps {
  node: FlowNode;
  onDrill: (node: FlowNode) => void;
}

const SubSections = ({ node, onDrill }: SubSectionsProps) => (
  <div className="mt-4 border-t border-border pt-3">
    <h4 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
      {plural(node.children.length, 'sub-section')}
    </h4>
    <ul className="mt-1.5 flex flex-col gap-1">
      {node.children.map((child) => (
        <li key={child.id}>
          <button
            type="button"
            onClick={() => onDrill(child)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-left text-xs transition-colors hover:border-[var(--surface-accent,var(--foreground))] hover:bg-muted"
          >
            <span className="min-w-0 flex-1 truncate">{child.label}</span>
            <span className="mono shrink-0 text-[0.625rem] text-muted-foreground">
              {child.descendantCount > 0 && `§${child.descendantCount} `}
              {child.skills.length > 0 && `◆${child.skills.length}`}
            </span>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  </div>
);
