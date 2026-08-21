import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleHeadingProps {
  // The bold half, uppercased. Anything that should stay bold goes here — SkillList keeps its
  // count in the title for that reason.
  title: string;
  // The normal-case tail after a `·`. This is where a collapsed section says what it still costs,
  // so it's the half worth reading once the rows are gone. A node rather than a string: the
  // subtotal in it is a token estimate, which explains itself on hover.
  note?: ReactNode;
  tooltip?: string;
  collapsed: boolean;
  onToggle: () => void;
}

// The heading every grouped list folds from. Four surfaces draw the same row — a chevron, an
// uppercase label, a count or a subtotal beside it — and they have to keep looking like each
// other, which is why it isn't written out per list.
//
// The toggle is on the wrapper rather than on a button around the whole row: the note holds a
// hover card with a button in it, and a `<button>` can't legally contain one. The inner button
// keeps the keyboard — its click bubbles up here, so Enter still folds the section.
export const CollapsibleHeading = ({
  title,
  note,
  tooltip,
  collapsed,
  onToggle
}: CollapsibleHeadingProps) => (
  <h2
    onClick={onToggle}
    title={tooltip}
    className="flex w-full items-center gap-1 rounded-md px-3 py-1 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:bg-accent"
  >
    <button
      type="button"
      aria-expanded={!collapsed}
      className="flex min-w-0 items-center gap-1 rounded-sm text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-ring"
    >
      {collapsed ? (
        <ChevronRight className="size-3.5 shrink-0" />
      ) : (
        <ChevronDown className="size-3.5 shrink-0" />
      )}
      <span className="truncate">{title}</span>
    </button>
    {note && <span className="min-w-0 font-normal normal-case"> · {note}</span>}
  </h2>
);
