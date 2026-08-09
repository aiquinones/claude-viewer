import { CSSProperties } from 'react';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { ConfigSnapshot, SystemPromptFile } from '../../model/types';
import { Button } from '@/components/ui/button';
import { PromptList } from '../PromptList';
import { alwaysLoads, formatTokens, plural, totals } from '../prompt-totals';
import { surfaceAccent } from '../surfaces';

interface SystemPromptViewProps {
  snapshot: ConfigSnapshot;
  onOpenFile: (path: string) => void;
  onRefresh: () => void;
  onBack: () => void;
}

// The CLAUDE.md stack in load order. One column, not a master/detail: the order *is* the content,
// and there's nothing per file worth a second pane that the row can't hold.
export const SystemPromptView = ({
  snapshot,
  onOpenFile,
  onRefresh,
  onBack
}: SystemPromptViewProps) => {
  const files: SystemPromptFile[] = snapshot.systemPrompt;
  // The headline counts only what loads every time — a number you can act on beats a worst case.
  const always = totals(alwaysLoads(files));

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('system-prompt') } as CSSProperties}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" title="Back" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <div className="mr-auto flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold">System Prompt</span>
          <span className="truncate text-xs text-muted-foreground">
            {plural(always.files, 'file')} · ~{formatTokens(always.estimatedTokens)} est. tokens on
            every request
            {!snapshot.workspaceRoot && ' · no folder open, user scope only'}
          </span>
        </div>
        <Button variant="ghost" size="icon" title="Refresh" onClick={onRefresh}>
          <RefreshCw />
        </Button>
      </header>

      {files.length === 0 ? (
        <Empty />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip px-2">
          <PromptList
            files={files}
            workspaceRoot={snapshot.workspaceRoot}
            onOpenFile={onOpenFile}
          />
        </div>
      )}
    </div>
  );
};

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No CLAUDE.md in this workspace or at <span className="mono mx-1">~/.claude/CLAUDE.md</span> —
    Claude starts here with no project instructions.
  </div>
);
