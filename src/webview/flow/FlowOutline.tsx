import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Blocks } from '../markdown/Blocks';
import { plural } from '../format-size';
import { SkillChip } from './SkillChip';
import { StepConnector } from './StepConnector';
import { FlowNode, SkillFlow } from './steps';

interface FlowOutlineProps {
  flow: SkillFlow;
  onOpenSkill: (path: string) => void;
}

// Variant C — no split, no canvas. A step opens where it stands and its sub-sections open inside
// it, so the whole skill is one column you can unfold as deep as it goes.
//
// The trade against A and B: nothing ever moves off screen, and nothing is ever side by side.
export const FlowOutline = ({ flow, onOpenSkill }: FlowOutlineProps) => {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string): void =>
    setOpen((current) => {
      const next: Set<string> = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <div className="h-full overflow-y-auto overflow-x-clip px-3 py-4">
      <ol className="mx-auto flex max-w-lg list-none flex-col items-stretch">
        {flow.steps.map((step, index) => (
          <li key={step.id} className="flex flex-col items-center">
            {index > 0 && <StepConnector active={open.has(step.id)} />}
            <OutlineNode
              node={step}
              index={index}
              depth={0}
              open={open}
              onToggle={toggle}
              onOpenSkill={onOpenSkill}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

interface OutlineNodeProps {
  node: FlowNode;
  // Only the top level shows a step number; below that the heading is the whole label.
  index: number;
  depth: number;
  open: Set<string>;
  onToggle: (id: string) => void;
  onOpenSkill: (path: string) => void;
}

const OutlineNode = ({ node, index, depth, open, onToggle, onOpenSkill }: OutlineNodeProps) => {
  const expanded: boolean = open.has(node.id);
  const empty: boolean = node.blocks.length === 0 && node.children.length === 0;

  return (
    <div
      className={`w-full rounded-lg border ${
        depth === 0 ? 'step-card step-card-plain' : 'border-border bg-muted/30'
      }`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => onToggle(node.id)}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left"
      >
        <ChevronRight
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        {depth === 0 && (
          <span className="step-badge mono flex size-5 shrink-0 items-center justify-center rounded-md text-[0.625rem] font-semibold">
            {index + 1}
          </span>
        )}
        <span className={`min-w-0 flex-1 truncate ${depth === 0 ? 'text-xs' : 'text-[0.6875rem]'}`}>
          {node.label}
        </span>
        <span className="mono shrink-0 text-[0.625rem] text-muted-foreground">
          {node.descendantCount > 0 && `§${node.descendantCount} `}
          {node.skills.length > 0 && `◆${node.skills.length}`}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border px-3 py-2">
          {node.skills.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {node.skills.map((reference) => (
                <SkillChip
                  key={reference.skill.path}
                  reference={reference}
                  onOpenSkill={onOpenSkill}
                />
              ))}
            </div>
          )}

          {node.blocks.length > 0 && (
            <div className="text-sm leading-relaxed">
              <Blocks tokens={node.blocks} />
            </div>
          )}

          {empty && (
            <p className="text-xs italic text-muted-foreground">
              nothing written directly under this heading
            </p>
          )}

          {node.children.length > 0 && (
            <div className="mt-2">
              <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {plural(node.children.length, 'sub-section')}
              </p>
              <div className="flex flex-col gap-1.5">
                {node.children.map((child, childIndex) => (
                  <OutlineNode
                    key={child.id}
                    node={child}
                    index={childIndex}
                    depth={depth + 1}
                    open={open}
                    onToggle={onToggle}
                    onOpenSkill={onOpenSkill}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
