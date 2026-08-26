import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import {
  AgentTool,
  ConfigSnapshot,
  MemoryDocument,
  MemoryEntry,
  MemorySet,
  Reveal
} from '../../model/types';
import { Button } from '@/components/ui/button';
import { ClaudeMemoryPane } from '../ClaudeMemoryPane';
import { CodexMemoryCard } from '../CodexMemoryCard';
import { CopilotMemoryCard } from '../CopilotMemoryCard';
import { MemoryTabs } from '../MemoryTabs';
import { PanelActions } from '../PanelActions';
import { formatTokens, plural } from '../format-size';
import { indexDocument } from '../memory-document';
import { useEstimate } from '../settings/SettingsContext';
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

// The memories Claude wrote about this workspace, split by which CLI wrote them. Claude's are files
// on disk; Copilot's are on GitHub and there is nothing here to list, which is why the two are tabs
// rather than one column.
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
  const estimate = useEstimate();

  const [tool, setTool] = useState<AgentTool>('claude');
  const [selection, setSelection] = useState<Selection | undefined>(undefined);

  // A pick is a path, and it resolves to either a memory or the index — both of which the body pane
  // renders, and only one of which is in `memories`. Memoized because the index branch builds its
  // document: a fresh object every render would re-fire the effects that watch this.
  const selected: MemoryDocument | undefined = useMemo(() => {
    if (!selection) return undefined;
    if (memory && selection.path === memory.index.path) return indexDocument(memory.index);
    return memories.find((entry) => entry.path === selection.path);
  }, [memory, memories, selection]);

  const select = (path: string): void => setSelection({ path, nonce: Date.now() });

  // Naming a memory from the spotlight selects it here, the same way a reveal selects a skill. It
  // also puts the tab it lives on up front, or the pick would land out of sight.
  useEffect(() => {
    if (!reveal) return;
    setTool('claude');
    setSelection({ path: reveal.path, nonce: reveal.nonce });
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
            {subtitle({ tool, memory, estimate })}
          </span>
        </div>
        <PanelActions
          // Only Claude's tab has something to scroll back to — the other holds one card.
          onGoToSelection={tool === 'claude' && inBody ? goToSelection : undefined}
          onSearch={onSearch}
          onRefresh={onRefresh}
        />
      </header>

      <div className="border-b border-border px-3">
        <MemoryTabs tool={tool} onChange={setTool} />
      </div>

      {tool !== 'claude' ? (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip px-2 pt-3">
          {tool === 'copilot' ? <CopilotMemoryCard /> : <CodexMemoryCard />}
        </div>
      ) : !memory ? (
        <NoWorkspace />
      ) : (
        <ClaudeMemoryPane
          memory={memory}
          // The snapshot's own clock — see ClaudeMemoryPane, which is where it's used.
          now={snapshot.loadedAt}
          selectedPath={selection?.path}
          document={selected}
          body={body}
          error={error}
          loading={loading}
          paneRef={paneRef}
          bodyAnchorRef={bodyAnchorRef}
          selectionRef={selectionRef}
          onSelect={select}
          onOpenFile={onOpenFile}
          onOpenLink={openLink}
        />
      )}
    </div>
  );
};

interface SubtitleArgs {
  tool: AgentTool;
  memory: MemorySet | undefined;
  estimate: (chars: number) => number;
}

// The two token figures are a claim about Claude's files, so they don't follow the other tabs —
// there is nothing on either of them for this surface to count.
const subtitle = ({ tool, memory, estimate }: SubtitleArgs): string => {
  if (tool === 'copilot') return 'kept on GitHub, fetched per session — nothing is stored here';
  if (tool === 'codex') return 'stored on this machine — this panel doesn\'t read them yet';
  if (!memory) return 'no folder open — memory is keyed on the working directory';

  return `${plural(memory.memories.length, 'memory', 'memories')} · ~${formatTokens(
    estimate(memory.index.chars)
  )} est. tokens every session`;
};

const NoWorkspace = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No folder is open. Memories are stored per working directory, so there is no directory to look
    in — and no user-scoped memory to fall back to.
  </div>
);
