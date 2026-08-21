import { plural } from '../format-size';
import { FlowNode } from './steps';

// Only one can be true. `faded` is every other card once one is open.
export type StepState = 'plain' | 'active' | 'faded';

interface StepCardProps {
  node: FlowNode;
  // Position in the sequence, 0-based. The badge is what carries the step number, which is why
  // `label` has its ordinal stripped.
  index: number;
  state: StepState;
  // The rail the flow shrinks to once a step is open: one line, badge and whatever label fits.
  compact?: boolean;
  onOpen: () => void;
}

// One step. Two lines and a narrow box on purpose — a single-line card stretched to the pane's
// width reads as a list row, and the point of the canvas is that these are nodes.
export const StepCard = ({ node, index, state, compact = false, onOpen }: StepCardProps) => (
  <div className="group relative flex w-full justify-center">
    <button
      type="button"
      aria-current={state === 'active'}
      onClick={onOpen}
      className={`step-card step-card-${state} flex w-full cursor-pointer gap-2.5 rounded-lg border text-left ${
        compact ? 'items-center px-2 py-2' : 'max-w-[15rem] items-start px-3 py-3'
      }`}
    >
      <span className="step-badge mono flex size-5 shrink-0 items-center justify-center rounded-md text-[0.625rem] font-semibold">
        {index + 1}
      </span>

      {compact ? (
        <span className="min-w-0 flex-1 truncate text-[0.6875rem]">{node.label}</span>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-xs font-medium leading-snug">{node.label}</span>
          {/* Always drawn, so every card is the same height and the column reads as a column. */}
          <span className="truncate text-[0.625rem] leading-none text-muted-foreground">
            {summary(node)}
          </span>
        </span>
      )}
    </button>

    <Mentions node={node} />
  </div>
);

// What's inside the step, spelled out. The two numbers were `§2 ◆1` on one line before, which is
// the sort of thing you have to be told how to read.
const summary = (node: FlowNode): string => {
  const parts: string[] = [];
  if (node.descendantCount > 0) parts.push(plural(node.descendantCount, 'sub-section'));
  if (node.skills.length > 0) parts.push(plural(node.skills.length, 'skill'));

  return parts.length > 0 ? parts.join(' · ') : 'no sub-sections';
};

interface MentionsProps {
  node: FlowNode;
}

// Which skills, on hover. The counts are on the card now, so this is only the part that wouldn't
// fit — a step that names nothing gets no popup rather than an empty one.
const Mentions = ({ node }: MentionsProps) => {
  if (node.skills.length === 0) return null;

  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1 z-30 ml-2 hidden w-max max-w-52 rounded-md border border-border bg-popover px-2 py-1.5 text-[0.6875rem] leading-relaxed text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100 lg:block"
    >
      <span className="block text-muted-foreground">names</span>
      <span className="mono block text-foreground">
        {node.skills.map((reference) => reference.skill.name).join(', ')}
      </span>
    </span>
  );
};
