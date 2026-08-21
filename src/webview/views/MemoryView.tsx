import { CSSProperties, useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ConfigSnapshot, MemoryEntry, MemorySet, Reveal } from '../../model/types';
import { Button } from '@/components/ui/button';
import { CopilotMemoryCard } from '../CopilotMemoryCard';
import { MemoryBody } from '../MemoryBody';
import { MemoryIndexCard } from '../MemoryIndexCard';
import { MemoryList } from '../MemoryList';
import { PanelActions } from '../PanelActions';
import { displayFolder } from '../display-path';
import { formatTokens, plural } from '../format-size';
import { MemoryTotals, memoryTotals } from '../memory-totals';
import { surfaceAccent } from '../surfaces';
import { useFileBody } from '../useFileBody';
import { useSelectionScroll } from '../useSelectionScroll';

interface MemoryViewProps {
  snapshot: ConfigSnapshot;
  // A memory named from outside the view — the spotlight does this.
  reveal?: Reveal;
  onOpenFile: (path: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// A pick, and when it happened. The nonce is what makes re-picking the memory that's already open
// scroll to it again — the path alone doesn't change, so nothing would fire.
interface Selection {
  path: string;
  nonce: number;
}

// The memories Claude wrote about this workspace, grouped by type, with the selected one rendered
// underneath. One column, the same shape as the system-prompt surface: the list is the view and the
// body sits below it in the same scroll.
export const MemoryView = ({
  snapshot,
  reveal,
  onOpenFile,
  onSearch,
  onRefresh,
  onBack
}: MemoryViewProps) => {
  const memory: MemorySet | undefined = snapshot.memory;
  const memories: MemoryEntry[] = memory?.memories ?? [];
  // What every memory here would cost if all of them were recalled — the ceiling, next to the
  // index's per-session floor.
  const recalled: MemoryTotals = memoryTotals(memories);

  const [selection, setSelection] = useState<Selection | undefined>(undefined);
  const selected: MemoryEntry | undefined = memories.find(
    (entry) => entry.path === selection?.path
  );

  const select = (path: string): void => setSelection({ path, nonce: Date.now() });

  // Naming a memory from the spotlight selects it here, the same way a reveal selects a skill.
  useEffect(() => {
    if (reveal) setSelection({ path: reveal.path, nonce: reveal.nonce });
  }, [reveal]);

  // A refresh can drop the file entirely — Claude deletes memories that turn out to be wrong.
  // Holding a path that no longer resolves would leave a body pane showing nothing.
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
    contentReady: !loading
  });

  // Following a `[[link]]`: the name is a memory's name, not a path.
  const openLink = (name: string): void => {
    const target: MemoryEntry | undefined = memories.find((entry) => entry.name === name);
    if (target) select(target.path);
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('memory') } as CSSProperties}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" title="Back" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <div className="mr-auto flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold">Memory</span>
          <span className="truncate text-xs text-muted-foreground">
            {memory
              ? `${plural(memories.length, 'memory', 'memories')} · ~${formatTokens(
                  memory.index.estimatedTokens
                )} est. tokens every session · ~${formatTokens(
                  recalled.estimatedTokens
                )} if all recalled`
              : 'no folder open — memory is keyed on the working directory'}
          </span>
        </div>
        <PanelActions
          onGoToSelection={inBody ? goToSelection : undefined}
          onSearch={onSearch}
          onRefresh={onRefresh}
        />
      </header>

      {!memory ? (
        <NoWorkspace />
      ) : (
        // This pane, not its children, is the scroll container the body's sticky headings resolve
        // against. `relative z-0` keeps their z-scale contained here rather than panel-wide.
        <div ref={paneRef} className="relative z-0 min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-3 px-2 pt-3">
            <MemoryIndexCard index={memory.index} onOpenFile={onOpenFile} />
            {memories.length === 0 && <Empty dir={memory.dir} />}
            <CopilotMemoryCard />
          </div>

          <div className="px-2">
            <MemoryList
              memories={memories}
              selectedPath={selection?.path}
              // The snapshot's own clock. A memory written four hours ago is still four hours ago a
              // minute later, so nothing here ticks — unlike the agents surface.
              now={snapshot.loadedAt}
              selectionRef={selectionRef}
              onSelect={(entry) => select(entry.path)}
            />
          </div>

          {/* Zero height, at the body's top edge: what the pick scrolls to, and what says you got
              there. A ref on the body itself would still count as on screen halfway down it. */}
          <div ref={bodyAnchorRef} />
          <MemoryBody
            memory={selected}
            body={body}
            error={error}
            loading={loading}
            onOpenLink={openLink}
          />
        </div>
      )}
    </div>
  );
};

interface EmptyProps {
  dir: string;
}

// Which directory was looked in, not just that it was empty: a worktree is its own working
// directory and gets its own memories, so "nothing here" is a claim about one path.
const Empty = ({ dir }: EmptyProps) => (
  <p className="px-3 py-2 text-sm text-muted-foreground">
    No memories yet in <span className="mono">{displayFolder({ path: dir, workspaceRoot: undefined })}</span> — Claude
    writes them itself as it learns something worth keeping.
  </p>
);

const NoWorkspace = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No folder is open. Memories are stored per working directory, so there is no directory to look
    in — and no user-scoped memory to fall back to.
  </div>
);
