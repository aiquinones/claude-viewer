import { FileText, Link2Off, SquareArrowOutUpRight } from 'lucide-react';
import { MemoryIndex, MemoryIndexEntry } from '../model/types';
import { cn } from '@/lib/utils';
import { IssueList } from './IssueList';
import { TokenEstimate } from './TokenEstimate';
import { Tooltip } from './Tooltip';
import { fileName } from './display-path';
import { formatBytes, plural } from './format-size';

interface MemoryIndexCardProps {
  index: MemoryIndex;
  // The index's text is showing below the list, the same way a picked memory's is.
  selected: boolean;
  onSelect: () => void;
  // The index itself, opened in the editor — it's the one file here nobody wrote by hand and
  // everybody ends up editing, so reading it below doesn't replace getting at it.
  onOpenFile: (path: string) => void;
}

// MEMORY.md: the only part of this directory that reaches a session unasked. Its cost is the
// headline number on the surface, and its dangling entries are half of why the surface exists.
//
// Only the broken entries are listed. The rest are the rows below, and saying them twice would make
// the card the list.
export const MemoryIndexCard = ({
  index,
  selected,
  onSelect,
  onOpenFile
}: MemoryIndexCardProps) => {
  const dangling: MemoryIndexEntry[] = index.entries.filter((entry) => !entry.path);

  return (
    <section
      className={cn(
        'flex flex-col gap-2 rounded-md border p-3 transition-colors',
        selected ? 'border-border bg-accent' : 'border-border'
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        {/* Selecting rather than opening, so the index reads below the list like every memory does.
            The editor is still one click away, on the button at the end of the row. */}
        <button
          type="button"
          onClick={onSelect}
          title={index.path}
          aria-pressed={selected}
          className="mono min-w-0 truncate text-left text-sm font-medium cursor-pointer hover:underline"
        >
          {fileName(index.path)}
        </button>
        <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
          {formatBytes(index.chars)} · <TokenEstimate chars={index.chars} />
        </span>
        {index.present && (
          <Tooltip label="Open in editor">
            <button
              type="button"
              onClick={() => onOpenFile(index.path)}
              aria-label="Open in editor"
              className="shrink-0 rounded p-0.5 text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <SquareArrowOutUpRight className="size-3.5" />
            </button>
          </Tooltip>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {index.present
          ? `Loaded into every session · ${plural(index.entries.length, 'entry', 'entries')}`
          : 'Not on disk — nothing about these memories reaches a session'}
        {dangling.length > 0 && ` · ${dangling.length} pointing at nothing`}
      </p>

      {dangling.length > 0 && (
        <ul className="flex flex-col gap-1">
          {dangling.map((entry) => (
            <li
              key={entry.target}
              className="flex min-w-0 items-center gap-2 text-xs text-warn"
              title={`${entry.title} → ${entry.target}`}
            >
              <Link2Off className="size-3.5 shrink-0" />
              <span className="truncate">{entry.title}</span>
              <span className="mono shrink-0 text-muted-foreground">{entry.target}</span>
            </li>
          ))}
        </ul>
      )}

      {index.issues.length > 0 && <IssueList issues={index.issues} />}
    </section>
  );
};
