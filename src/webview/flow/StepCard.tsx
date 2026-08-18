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
  // The rail the flow shrinks to once a step is open: the badge, and the label if it fits.
  compact?: boolean;
  onOpen: () => void;
}

// One step. The same card in all three variants — what differs between them is where it sits and
// what happens around it when you click.
export const StepCard = ({ node, index, state, compact = false, onOpen }: StepCardProps) => (
  <div className="group relative flex w-full justify-center">
    <button
      type="button"
      aria-current={state === 'active'}
      onClick={onOpen}
      className={`step-card step-card-${state} flex ${
        compact ? 'w-full gap-2 px-2 py-2' : 'w-full max-w-sm gap-2.5 px-3 py-2.5'
      } cursor-pointer items-center rounded-lg border text-left`}
    >
      <span className="step-badge mono flex size-5 shrink-0 items-center justify-center rounded-md text-[0.625rem] font-semibold">
        {index + 1}
      </span>
      <span className={`min-w-0 flex-1 truncate ${compact ? 'text-[0.6875rem]' : 'text-xs'}`}>
        {node.label}
      </span>
      {!compact && <Counts node={node} />}
    </button>

    <Summary node={node} />
  </div>
);

interface CountsProps {
  node: FlowNode;
}

// The two numbers on the card itself, so the shape of a step is readable without hovering. Dots
// rather than words — the popup spells them out.
const Counts = ({ node }: CountsProps) => {
  if (node.descendantCount === 0 && node.skills.length === 0) return null;

  return (
    <span className="mono flex shrink-0 items-center gap-1.5 text-[0.625rem] text-muted-foreground">
      {node.descendantCount > 0 && <span>§{node.descendantCount}</span>}
      {node.skills.length > 0 && (
        <span className="step-skill-count">◆{node.skills.length}</span>
      )}
    </span>
  );
};

interface SummaryProps {
  node: FlowNode;
}

// What's inside, on hover. A step with neither sub-sections nor references has nothing to preview,
// so it gets no popup rather than an empty one.
const Summary = ({ node }: SummaryProps) => {
  if (node.descendantCount === 0 && node.skills.length === 0) return null;

  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1 z-30 ml-2 hidden w-max max-w-56 rounded-md border border-border bg-popover px-2 py-1.5 text-[0.6875rem] leading-relaxed text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 lg:block"
    >
      <span className="block text-muted-foreground">
        {plural(node.descendantCount, 'sub-section')}
      </span>
      <span className="block text-muted-foreground">
        {plural(node.skills.length, 'skill')} mentioned
      </span>
      {node.skills.length > 0 && (
        <span className="mono mt-1 block truncate text-foreground">
          {node.skills.map((reference) => reference.skill.name).join(', ')}
        </span>
      )}
    </span>
  );
};
