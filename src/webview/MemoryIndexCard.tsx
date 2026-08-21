import { FileText, Link2Off } from 'lucide-react';
import { MemoryIndex, MemoryIndexEntry } from '../model/types';
import { IssueList } from './IssueList';
import { fileName } from './display-path';
import { formatBytes, formatTokens, plural } from './format-size';

interface MemoryIndexCardProps {
  index: MemoryIndex;
  // The index itself, opened in the editor — it's the one file here nobody wrote by hand and
  // everybody ends up editing.
  onOpenFile: (path: string) => void;
}

// MEMORY.md: the only part of this directory that reaches a session unasked. Its cost is the
// headline number on the surface, and its dangling entries are half of why the surface exists.
//
// Only the broken entries are listed. The rest are the rows below, and saying them twice would make
// the card the list.
export const MemoryIndexCard = ({ index, onOpenFile }: MemoryIndexCardProps) => {
  const dangling: MemoryIndexEntry[] = index.entries.filter((entry) => !entry.path);

  return (
    <section className="flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex min-w-0 items-center gap-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <button
          type="button"
          onClick={() => onOpenFile(index.path)}
          title={index.path}
          className="mono truncate text-sm font-medium cursor-pointer hover:underline"
        >
          {fileName(index.path)}
        </button>
        <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
          {formatBytes(index.chars)} · ~{formatTokens(index.estimatedTokens)}
        </span>
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
