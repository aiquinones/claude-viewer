import { ChevronDown, ChevronRight } from 'lucide-react';
import { plural } from '../format-size';

interface SubagentToggleProps {
  count: number;
  open: boolean;
  onToggle: () => void;
}

// What opens the list of sub-agents under a row. Collapsed by default: most rows have none, and a
// row that does is still mostly about the session itself.
//
// It stops its own click, or opening the list also opens the agent behind it. That's safe here and
// isn't on the PR link beside it — a link is opened by a listener on the frame's window, which a
// `stopPropagation` never reaches, while this is a plain button React handles itself.
export const SubagentToggle = ({ count, open, onToggle }: SubagentToggleProps) => (
  <button
    type="button"
    aria-expanded={open}
    onClick={(event) => {
      event.stopPropagation();
      onToggle();
    }}
    className="mono flex shrink-0 items-center gap-1 rounded-sm text-xs text-muted-foreground cursor-pointer hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
  >
    {open ? (
      <ChevronDown className="size-3.5 shrink-0" />
    ) : (
      <ChevronRight className="size-3.5 shrink-0" />
    )}
    {plural(count, 'subagent')}
  </button>
);
