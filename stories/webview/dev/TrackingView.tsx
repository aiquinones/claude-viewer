import { useEffect, useMemo, useState } from 'react';
import { Markdown, STICKY_ROW_CLASS } from '@src/webview/markdown/Markdown';
import { STICKY_TOP_Z } from '@src/webview/z-layers';
import { CopyId } from './CopyId';
import { TrackedList } from './TrackedList';
import { TrackedItem, sortTracked } from './tracked-items';

interface TrackingViewProps {
  items: TrackedItem[];
  // The id to open on mount — how `?id=` on the Storybook URL lands you on one item.
  initialId?: string;
}

// The tracking folder, rendered. A dev tool: it lives in a story, never in the panel, and the
// extension's esbuild bundles never reach it.
//
// `h-screen` rather than `h-full`: nothing outside ViewSlider sets a height in this webview, so a
// percentage here would collapse to its content.
export const TrackingView = ({ items, initialId }: TrackingViewProps) => {
  const sorted: TrackedItem[] = useMemo(() => sortTracked(items), [items]);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);

  // The URL is allowed to change under a live story, and it wins over whatever was clicked — the
  // same rule a reveal follows in SkillView.
  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  const selected: TrackedItem | undefined =
    sorted.find((item) => item.id === selectedId) ?? sorted[0];
  const open: number = sorted.filter((item) => item.group === 'open').length;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">Tracked items</span>
          <span className="text-xs text-muted-foreground">
            {sorted.length} in tracking/ideas · {open} open · {sorted.length - open} closed
          </span>
        </div>
      </header>

      {sorted.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(200px,280px)_minmax(0,1fr)] overflow-x-clip">
          <div className="min-w-0 overflow-y-auto border-r border-border">
            <TrackedList
              items={sorted}
              selectedId={selected?.id}
              onSelect={(item) => setSelectedId(item.id)}
            />
          </div>

          {/* The pane is the scroll container the sticky headings resolve against, so the padding
              sits on the children. `relative z-0` keeps their z-scale to itself. */}
          <div className="relative z-0 min-w-0 overflow-y-auto overflow-x-clip">
            {selected && <Body item={selected} />}
          </div>
        </div>
      )}
    </div>
  );
};

interface BodyProps {
  item: TrackedItem;
}

const Body = ({ item }: BodyProps) => (
  <section className="flex flex-col px-5 pb-8">
    <IdTitle item={item} />
    <div className="pt-3">
      {item.body.trim() ? (
        // One row is pinned above, so every heading in here starts a slot lower.
        <Markdown raw={item.body} offsetRows={1} />
      ) : (
        <p className="text-sm italic text-muted-foreground">nothing below the frontmatter</p>
      )}
    </div>
  </section>
);

// Row 0 of the pinned stack: the id you'd paste, its status, and the copy button — so the thing
// the view exists for stays reachable however far down the note you've scrolled.
const IdTitle = ({ item }: BodyProps) => (
  <h2
    style={{ zIndex: STICKY_TOP_Z }}
    className={`sticky top-0 -mx-5 flex ${STICKY_ROW_CLASS} items-center gap-2 border-b border-border bg-background px-5 text-xs`}
  >
    <span className="mono min-w-0 truncate font-semibold text-foreground">{item.id}</span>
    <span className="shrink-0 text-muted-foreground">
      {item.status}
      {item.created && ` · created ${item.created}`}
      {item.closed && ` · closed ${item.closed}`}
    </span>
    <CopyId id={item.id} className="ml-auto" />
  </h2>
);

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No notes in <span className="mono mx-1">tracking/ideas/</span> — the folder is gitignored, so a
    fresh clone has none.
  </div>
);
