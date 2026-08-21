import { CircleAlert } from 'lucide-react';
import { MemoryDocument, MemoryLink } from '../model/types';
import { Loading } from './loading/Loading';
import { Markdown, STICKY_ROW_CLASS } from './markdown/Markdown';

interface MemoryBodyProps {
  // The selected document, or undefined when nothing is selected — in which case nothing renders.
  // MEMORY.md is one of these too, which is why it's a MemoryDocument and not a MemoryEntry.
  memory: MemoryDocument | undefined;
  // The file's text below its frontmatter. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  // Following a `[[link]]` selects that memory, when there is one to select.
  onOpenLink: (name: string) => void;
}

// The selected document, rendered under the list. A memory's frontmatter is stripped host-side —
// the name and the description are already the row, so the body is the fact itself. MEMORY.md comes
// down whole, because every line of it reaches a session.
//
// `px-5` is what the sticky headings inside reach back through, so the two have to agree.
export const MemoryBody = ({ memory, body, error, loading, onOpenLink }: MemoryBodyProps) => {
  if (!memory) return null;

  return (
    <section className="flex flex-col border-t border-border px-5 pb-8 pt-4">
      <h2
        title={memory.path}
        style={{ zIndex: 30 }}
        className={`mono sticky top-0 -mx-5 flex ${STICKY_ROW_CLASS} items-center gap-2 border-b border-border bg-background px-5 text-xs text-muted-foreground`}
      >
        <span className="shrink-0 font-semibold text-foreground">{memory.name}</span>
      </h2>

      {memory.description && (
        <p className="pt-3 text-sm text-muted-foreground">{memory.description}</p>
      )}

      <div className="pt-2">
        <Content memory={memory} body={body} error={error} loading={loading} />
      </div>

      <MemoryLinks links={memory.links} onOpenLink={onOpenLink} />
    </section>
  );
};

interface ContentProps {
  memory: MemoryDocument;
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
}

const Content = ({ memory, body, error, loading }: ContentProps) => {
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-error">
        <CircleAlert className="mt-px size-3.5 shrink-0" />
        <span>could not read the file: {error}</span>
      </p>
    );
  }
  if (loading) return <Loading label="Reading…" />;

  if (!body?.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {memory.issues.length ? 'nothing is read from this file' : 'the file is empty'}
      </p>
    );
  }

  // One row is already pinned above, so every heading in here starts a slot lower.
  return <Markdown raw={body} offsetRows={1} />;
};

interface MemoryLinksProps {
  links: MemoryLink[];
  onOpenLink: (name: string) => void;
}

// The `[[links]]` this memory makes. An unresolved one is dimmed rather than flagged: the memory
// instructions say a link with no target marks something worth writing later.
const MemoryLinks = ({ links, onOpenLink }: MemoryLinksProps) => {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Links</h3>
      <ul className="flex flex-wrap gap-1">
        {links.map((link) => (
          <li key={link.name}>
            <button
              type="button"
              disabled={!link.resolved}
              onClick={() => onOpenLink(link.name)}
              title={link.resolved ? link.name : `${link.name} — not written yet`}
              className={`mono rounded-full bg-muted px-2 py-0.5 text-xs ${
                link.resolved
                  ? 'text-muted-foreground cursor-pointer hover:text-foreground'
                  : 'text-muted-foreground opacity-50'
              }`}
            >
              {link.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
