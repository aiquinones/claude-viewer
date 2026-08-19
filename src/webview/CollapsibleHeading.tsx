import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleHeadingProps {
  // The bold half, uppercased. Anything that should stay bold goes here — SkillList keeps its
  // count in the title for that reason.
  title: string;
  // The normal-case tail after a `·`. This is where a collapsed section says what it still costs,
  // so it's the half worth reading once the rows are gone.
  note?: string;
  tooltip?: string;
  collapsed: boolean;
  onToggle: () => void;
}

// The heading every grouped list folds from. Four surfaces draw the same row — a chevron, an
// uppercase label, a count or a subtotal beside it — and they have to keep looking like each
// other, which is why it isn't written out per list.
export const CollapsibleHeading = ({
  title,
  note,
  tooltip,
  collapsed,
  onToggle
}: CollapsibleHeadingProps) => (
  <h2>
    <button
      type="button"
      onClick={onToggle}
      title={tooltip}
      aria-expanded={!collapsed}
      className="flex w-full items-center gap-1 rounded-md px-3 py-1 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:bg-accent"
    >
      {collapsed ? (
        <ChevronRight className="size-3.5 shrink-0" />
      ) : (
        <ChevronDown className="size-3.5 shrink-0" />
      )}
      <span>
        {title}
        {note && <span className="normal-case font-normal"> · {note}</span>}
      </span>
    </button>
  </h2>
);
