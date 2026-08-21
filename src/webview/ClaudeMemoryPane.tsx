import { RefObject } from 'react';
import { MemoryDocument, MemoryEntry, MemorySet } from '../model/types';
import { MemoryBody } from './MemoryBody';
import { MemoryIndexCard } from './MemoryIndexCard';
import { MemoryList } from './MemoryList';
import { displayFolder } from './display-path';
import { Z } from './z-layers';

interface ClaudeMemoryPaneProps {
  memory: MemorySet;
  // The snapshot's own clock. A memory written four hours ago is still four hours ago a minute
  // later, so nothing here ticks — unlike the agents surface.
  now: number;
  // Path of whatever is showing below the list — a memory, or MEMORY.md itself.
  selectedPath: string | undefined;
  // That path resolved to something the body pane can render.
  document: MemoryDocument | undefined;
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  paneRef: RefObject<HTMLDivElement>;
  bodyAnchorRef: RefObject<HTMLDivElement>;
  selectionRef: RefObject<HTMLDivElement>;
  onSelect: (path: string) => void;
  onOpenFile: (path: string) => void;
  onOpenLink: (name: string) => void;
}

// Claude's half of the surface: the index, the memories grouped by type, and whichever of them is
// open rendered underneath. One column, the same shape as the system-prompt surface.
export const ClaudeMemoryPane = ({
  memory,
  now,
  selectedPath,
  document,
  body,
  error,
  loading,
  paneRef,
  bodyAnchorRef,
  selectionRef,
  onSelect,
  onOpenFile,
  onOpenLink
}: ClaudeMemoryPaneProps) => (
  // This pane, not its children, is the scroll container the body's sticky headings resolve
  // against. `Z.contained` keeps their z-scale here rather than panel-wide.
  <div
    ref={paneRef}
    style={{ zIndex: Z.contained }}
    className="relative min-h-0 flex-1 overflow-y-auto overflow-x-clip"
  >
    <div className="flex flex-col gap-3 px-2 pt-3">
      <MemoryIndexCard
        index={memory.index}
        selected={selectedPath === memory.index.path}
        onSelect={() => onSelect(memory.index.path)}
        onOpenFile={onOpenFile}
      />
      {memory.memories.length === 0 && <Empty dir={memory.dir} />}
    </div>

    <div className="px-2">
      <MemoryList
        memories={memory.memories}
        selectedPath={selectedPath}
        now={now}
        selectionRef={selectionRef}
        onSelect={(entry: MemoryEntry) => onSelect(entry.path)}
      />
    </div>

    {/* Zero height, at the body's top edge: what the pick scrolls to, and what says you got there.
        A ref on the body itself would still count as on screen halfway down it. */}
    <div ref={bodyAnchorRef} />
    <MemoryBody
      memory={document}
      body={body}
      error={error}
      loading={loading}
      onOpenLink={onOpenLink}
    />
  </div>
);

interface EmptyProps {
  dir: string;
}

// Which directory was looked in, not just that it was empty: a worktree is its own working
// directory and gets its own memories, so "nothing here" is a claim about one path.
const Empty = ({ dir }: EmptyProps) => (
  <p className="px-3 py-2 text-sm text-muted-foreground">
    No memories yet in{' '}
    <span className="mono">{displayFolder({ path: dir, workspaceRoot: undefined })}</span> — Claude
    writes them itself as it learns something worth keeping.
  </p>
);
