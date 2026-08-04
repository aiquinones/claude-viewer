import { ReactNode } from 'react';
import { EyeOff } from 'lucide-react';
import { SearchHit } from '../../model/types';
import { cn } from '@/lib/utils';

interface SpotlightRowProps {
  hit: SearchHit;
  active: boolean;
  // Stable id, so the input can point aria-activedescendant at this row.
  optionId: string;
  onChoose: () => void;
  onHover: () => void;
}

// The name with the query's characters picked out, then what kind of thing it is. The kind tag is
// what keeps one list readable once skills aren't the only thing in the index.
export const SpotlightRow = ({ hit, active, optionId, onChoose, onHover }: SpotlightRowProps) => (
  <button
    id={optionId}
    type="button"
    role="option"
    aria-selected={active}
    onClick={onChoose}
    onMouseMove={onHover}
    // Keeps the caret in the input: a mousedown on a button would take focus off it.
    onMouseDown={(event) => event.preventDefault()}
    className={cn(
      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left cursor-pointer',
      active ? 'bg-selected text-selected-foreground' : 'hover:bg-accent',
      hit.doc.inactive && !active && 'opacity-55'
    )}
  >
    {hit.doc.inactive && <EyeOff className="size-3.5 shrink-0" />}
    <span className="truncate text-sm font-medium">
      <Highlighted label={hit.doc.label} positions={hit.positions} active={active} />
    </span>
    <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">{hit.doc.kind}</span>
  </button>
);

interface HighlightedProps {
  label: string;
  positions: number[];
  // The active row already sits on the selection color, where the match color loses contrast.
  active: boolean;
}

const Highlighted = ({ label, positions, active }: HighlightedProps) => {
  const matched: Set<number> = new Set(positions);
  const characters: ReactNode[] = [];

  for (let i = 0; i < label.length; i++) {
    characters.push(
      matched.has(i) ? (
        <span key={i} className={cn('font-bold', !active && 'text-match')}>
          {label[i]}
        </span>
      ) : (
        label[i]
      )
    );
  }

  return <>{characters}</>;
};
