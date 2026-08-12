import { CSSProperties, useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ConfigSnapshot, SystemPromptFile } from '../../model/types';
import { Button } from '@/components/ui/button';
import { PanelActions } from '../PanelActions';
import { PromptBody } from '../PromptBody';
import { PromptList } from '../PromptList';
import { formatTokens, plural } from '../format-size';
import { alwaysLoads, totals } from '../prompt-totals';
import { surfaceAccent } from '../surfaces';
import { useFileBody } from '../useFileBody';
import { useSelectionScroll } from '../useSelectionScroll';

interface SystemPromptViewProps {
  snapshot: ConfigSnapshot;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// A pick, and when it happened. The nonce is what makes re-picking the file that's already open
// scroll to it again — the order alone doesn't change, so nothing would fire.
interface Selection {
  order: number;
  nonce: number;
}

// The CLAUDE.md stack in load order, with the selected file rendered underneath it. One column
// rather than the skills surface's two panes: the order *is* the content here, so the list stays
// the view and the body sits below it in the same scroll rather than beside it.
export const SystemPromptView = ({
  snapshot,
  onSearch,
  onRefresh,
  onBack
}: SystemPromptViewProps) => {
  const files: SystemPromptFile[] = snapshot.systemPrompt;
  // The headline counts only what loads every time — a number you can act on beats a worst case.
  const always = totals(alwaysLoads(files));

  // Which file's text is showing. Nothing is selected to begin with, and nothing renders until
  // something is — the list is the view, the body is what you asked for on top of it.
  const [selection, setSelection] = useState<Selection | undefined>(undefined);
  const selected: SystemPromptFile | undefined = files.find(
    (file) => file.order === selection?.order
  );

  // A refresh can renumber the list or drop the file entirely. Holding an order that no longer
  // resolves would leave the body pane showing nothing with a row still lit, so it clears.
  useEffect(() => {
    if (selection && !selected) setSelection(undefined);
  }, [selection, selected]);

  const { body, error, loading } = useFileBody({
    path: selected?.path,
    loadedAt: snapshot.loadedAt
  });

  const { paneRef, bodyAnchorRef, selectionRef, inBody, goToSelection } = useSelectionScroll({
    hasSelection: selected !== undefined,
    selectionNonce: selection?.nonce ?? 0,
    // An error is an answer too — short, but final, so there's no second arrival to wait for.
    contentReady: !loading
  });

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
        {/* The way back up, and only once you're far enough down to have lost the list. */}
        <PanelActions
          onGoToSelection={inBody ? goToSelection : undefined}
          onSearch={onSearch}
          onRefresh={onRefresh}
        />
      </header>

      {files.length === 0 ? (
        <Empty />
      ) : (
        // This pane, not its children, is the scroll container the body's sticky headings resolve
        // against. `relative z-0` keeps their z-scale contained here rather than panel-wide.
        <div
          ref={paneRef}
          className="relative z-0 min-h-0 flex-1 overflow-y-auto overflow-x-clip"
        >
          <div className="px-2">
            <PromptList
              files={files}
              selectedOrder={selection?.order}
              workspaceRoot={snapshot.workspaceRoot}
              selectionRef={selectionRef}
              onSelect={(file) => setSelection({ order: file.order, nonce: Date.now() })}
            />
          </div>
          {/* Zero height, at the body's top edge: what the pick scrolls to, and what says you got
              there. A ref on the body itself would still count as on screen halfway down it. */}
          <div ref={bodyAnchorRef} />
          <PromptBody
            file={selected}
            body={body}
            error={error}
            loading={loading}
            workspaceRoot={snapshot.workspaceRoot}
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
