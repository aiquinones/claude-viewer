import { RefObject } from 'react';
import { CornerDownRight } from 'lucide-react';
import { SystemPromptFile } from '../model/types';
import { cn } from '@/lib/utils';
import { IssueList } from './IssueList';
import { ScopeBadge } from './ScopeBadge';
import { displayDirectory, fileName } from './display-path';
import { formatBytes } from './format-size';
import { TokenEstimate } from './TokenEstimate';

interface PromptFileRowProps {
  file: SystemPromptFile;
  // Chars in the whole group, so the bar can show this file's share of it.
  groupChars: number;
  selected: boolean;
  workspaceRoot: string | undefined;
  // Held by the view and attached here only while this row is the selected one — it's what
  // "go to selection" scrolls back to.
  selectionRef?: RefObject<HTMLDivElement>;
  onSelect: (file: SystemPromptFile) => void;
}

// Each import hop indents this far. A step rather than a class per level, so a file five imports
// deep still lines up.
const INDENT_PER_DEPTH: number = 14;

// One file in the load order: what it is, where it came from, what it costs. Clicking selects it,
// which renders it below.
//
// The click and the hover are on the wrapper, not on a button wrapping the whole row: the token
// estimate opens a card with a button in it, and a `<button>` can hold neither that nor the
// `<ul>` of issues. The inner button keeps the keyboard — its click bubbles to the wrapper, so
// Enter still selects — and everything interactive stays its sibling.
export const PromptFileRow = ({
  file,
  groupChars,
  selected,
  workspaceRoot,
  selectionRef,
  onSelect
}: PromptFileRowProps) => {
  const share: number = groupChars > 0 ? (file.chars / groupChars) * 100 : 0;
  const broken: boolean = file.issues.some((issue) => issue.severity === 'error');

  return (
    <div
      ref={selected ? selectionRef : undefined}
      className="flex flex-col"
      style={{ paddingLeft: file.depth * INDENT_PER_DEPTH }}
    >
      <div
        onClick={() => onSelect(file)}
        title={file.path}
        className={cn(
          'flex w-full min-w-0 flex-col gap-1.5 rounded-md px-3 py-2 text-left cursor-pointer',
          selected ? 'bg-accent' : 'hover:bg-accent'
        )}
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          <button
            type="button"
            aria-pressed={selected}
            className="flex min-w-0 items-center gap-2 rounded-sm text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="mono w-5 shrink-0 text-right text-xs text-muted-foreground">
              {file.order}
            </span>
            {file.importedBy && (
              <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            <span
              className={cn(
                'truncate text-sm font-medium',
                broken && 'text-error',
                selected && !broken && 'text-foreground'
              )}
            >
              {fileName(file.path)}
            </span>
          </button>
          <ScopeBadge scope={file.scope} />
          <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
            {formatBytes(file.chars)} · <TokenEstimate chars={file.chars} />
          </span>
        </span>

        <span className="mono w-full truncate pl-7 text-xs text-muted-foreground">
          {displayDirectory({ path: file.path, workspaceRoot })}
          {file.conditionalOn && ` · loads only under ${file.conditionalOn}/`}
        </span>

        {/* Share of the group, so the total in the header has something to point at. */}
        <span className="ml-7 flex h-1 w-[calc(100%-1.75rem)] overflow-hidden rounded-full bg-border">
          <span
            className="h-full rounded-full"
            style={{ width: `${share}%`, background: 'var(--surface-accent)' }}
          />
        </span>
      </div>

      {file.issues.length > 0 && (
        <div className="px-3 pb-2 pl-10">
          <IssueList issues={file.issues} />
        </div>
      )}
    </div>
  );
};
