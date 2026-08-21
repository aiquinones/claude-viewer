import { useEffect, useRef } from 'react';
import { cn } from '@src/webview/lib/utils';
import { CopyId } from './CopyId';
import { TrackedItem } from './tracked-items';

interface TrackedRowProps {
  item: TrackedItem;
  selected: boolean;
  onSelect: (item: TrackedItem) => void;
}

// The title takes the row and the id sits under it, because the id is what you copy but the title
// is what you scan for. Same shape as SkillRow, and for the same reason.
//
// The wrapper is a div rather than a button: a <button> can't hold the copy button, which is the
// AgentRow problem. The click and the keyboard handler live here, and CopyId stops propagation.
export const TrackedRow = ({ item, selected, onSelect }: TrackedRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) rowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
      className={cn(
        'flex w-full items-center gap-1 rounded-md px-3 py-2 text-left cursor-pointer',
        selected ? 'bg-selected text-selected-foreground' : 'hover:bg-accent',
        item.group === 'closed' && !selected && 'opacity-55'
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{item.title}</span>
        <span className="mono truncate text-xs text-muted-foreground">{item.id}</span>
      </span>
      <CopyId id={item.id} />
    </div>
  );
};
