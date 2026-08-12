import { RefObject } from 'react';
import { CornerDownRight } from 'lucide-react';
import { SystemPromptFile } from '../model/types';
import { cn } from '@/lib/utils';
import { IssueList } from './IssueList';
import { ScopeBadge } from './ScopeBadge';
import { displayDirectory, fileName } from './display-path';
import { formatBytes, formatTokens } from './format-size';

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
// The issues sit outside the button: IssueList is a <ul>, which a <button> can't legally hold.
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
        <button
          type="button"
          onClick={() => onSelect(file)}
          title={file.path}
          aria-pressed={selected}
          className={cn(
            'flex w-full min-w-0 flex-col gap-1.5 rounded-md px-3 py-2 text-left cursor-pointer',
            selected ? 'bg-accent' : 'hover:bg-accent'
          )}
        >
          <span className="flex w-full min-w-0 items-center gap-2">
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
            <ScopeBadge scope={file.scope} />
            <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">
              {formatBytes(file.chars)} · ~{formatTokens(file.estimatedTokens)}
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
      </button>

      {file.issues.length > 0 && (
        <div className="px-3 pb-2 pl-10">
          <IssueList issues={file.issues} />
        </div>
      )}
    </div>
  );
};
