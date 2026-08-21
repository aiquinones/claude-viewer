import { RefObject } from 'react';
import { Link2Off } from 'lucide-react';
import { MemoryEntry } from '../model/types';
import { cn } from '@/lib/utils';
import { IssueList } from './IssueList';
import { MemoryTypeBadge } from './MemoryTypeBadge';
import { formatAge } from './format-age';
import { formatTokens } from './format-size';

interface MemoryRowProps {
  memory: MemoryEntry;
  selected: boolean;
  // The panel's clock, so every row on screen ages against the same instant.
  now: number;
  // Held by the view and attached here only while this row is the selected one — it's what
  // "go to selection" scrolls back to.
  selectionRef?: RefObject<HTMLDivElement>;
  onSelect: (memory: MemoryEntry) => void;
}

// One memory: what it says, when it was written, what it costs if it's recalled. Clicking selects
// it, which renders its text below the list.
//
// The issues sit outside the button: IssueList is a <ul>, which a <button> can't legally hold.
export const MemoryRow = ({ memory, selected, now, selectionRef, onSelect }: MemoryRowProps) => {
  const broken: boolean = memory.issues.some((issue) => issue.severity === 'error');

  return (
    <div ref={selected ? selectionRef : undefined} className="flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(memory)}
        title={memory.path}
        aria-pressed={selected}
        className={cn(
          'flex w-full min-w-0 flex-col gap-1 rounded-md px-3 py-2 text-left cursor-pointer',
          selected ? 'bg-accent' : 'hover:bg-accent'
        )}
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          {/* A memory nothing points at is the one row state worth seeing before you read it. */}
          {!memory.indexed && <Link2Off className="size-3.5 shrink-0 text-warn" />}
          <span
            className={cn(
              'mono truncate text-sm font-medium',
              broken && 'text-error',
              !memory.indexed && !broken && 'text-warn',
              selected && !broken && memory.indexed && 'text-foreground'
            )}
          >
            {memory.name}
          </span>
          <MemoryTypeBadge type={memory.type} declaredType={memory.declaredType} />
          <span className="mono ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {/* Absolute on the entry, aged here — the same rule the agents surface follows. */}
            <span>{memory.modifiedAt ? formatAge(Math.max(0, now - memory.modifiedAt)) : '—'}</span>
            <span>~{formatTokens(memory.estimatedTokens)}</span>
          </span>
        </span>

        <span className="w-full truncate text-xs text-muted-foreground">
          {memory.description || 'no description'}
        </span>
      </button>

      {memory.issues.length > 0 && (
        <div className="px-3 pb-2 pl-6">
          <IssueList issues={memory.issues} />
        </div>
      )}
    </div>
  );
};
