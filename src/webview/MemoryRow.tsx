import { RefObject } from 'react';
import { Link2Off } from 'lucide-react';
import { MemoryEntry } from '../model/types';
import { cn } from '@/lib/utils';
import { IssueList } from './IssueList';
import { TokenEstimate } from './TokenEstimate';
import { formatAge } from './format-age';

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
// The click is on the wrapper rather than on a button around the whole row: the token estimate
// opens a card with a button in it, and a <button> can hold neither that nor the <ul> of issues.
// The inner button keeps the keyboard — its click bubbles up here, so Enter still selects.
export const MemoryRow = ({ memory, selected, now, selectionRef, onSelect }: MemoryRowProps) => {
  const broken: boolean = memory.issues.some((issue) => issue.severity === 'error');

  return (
    <div ref={selected ? selectionRef : undefined} className="flex flex-col">
      <div
        onClick={() => onSelect(memory)}
        title={memory.path}
        className={cn(
          'flex w-full min-w-0 flex-col gap-1 rounded-md px-3 py-2 text-left cursor-pointer',
          selected ? 'bg-accent' : 'hover:bg-accent'
        )}
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          {/* A memory nothing points at is the one row state worth seeing before you read it. */}
          {!memory.indexed && <Link2Off className="size-3.5 shrink-0 text-warn" />}
          <button
            type="button"
            aria-pressed={selected}
            className={cn(
              'mono min-w-0 truncate rounded-sm text-left text-sm font-medium cursor-pointer focus-visible:ring-1 focus-visible:ring-ring',
              broken && 'text-error',
              !memory.indexed && !broken && 'text-warn',
              selected && !broken && memory.indexed && 'text-foreground'
            )}
          >
            {memory.name}
          </button>
          <span className="mono ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {/* Absolute on the entry, aged here — the same rule the agents surface follows. */}
            <span>{memory.modifiedAt ? formatAge(Math.max(0, now - memory.modifiedAt)) : '—'}</span>
            <TokenEstimate chars={memory.chars} />
          </span>
        </span>

        <span className="w-full truncate text-xs text-muted-foreground">
          {memory.description || 'no description'}
        </span>
      </div>

      {memory.issues.length > 0 && (
        <div className="px-3 pb-2 pl-6">
          <IssueList issues={memory.issues} />
        </div>
      )}
    </div>
  );
};
