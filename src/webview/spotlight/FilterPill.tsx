import { X } from 'lucide-react';
import { SearchKind } from '../../model/types';

interface FilterPillProps {
  kind: SearchKind;
  onRemove: () => void;
}

// One narrowing sitting in the search bar. It reads as a scope on the box rather than as text you
// typed, which is the whole point of lifting `filter:skill` out of the query.
export const FilterPill = ({ kind, onRemove }: FilterPillProps) => (
  <span className="flex shrink-0 items-center gap-1 rounded-md bg-accent py-1 pl-2 pr-1 text-xs">
    <span className="mono">{kind}</span>
    <button
      type="button"
      aria-label={`Remove ${kind} filter`}
      onClick={onRemove}
      // Keeps the caret in the input: a mousedown on a button would take focus off it.
      onMouseDown={(event) => event.preventDefault()}
      className="flex items-center rounded-sm text-muted-foreground cursor-pointer hover:text-foreground"
    >
      <X className="size-3.5" />
    </button>
  </span>
);
