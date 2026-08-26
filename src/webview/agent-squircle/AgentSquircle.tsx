import { LucideIcon } from 'lucide-react';

interface AgentSquircleProps {
  icon: LucideIcon;
  label: string;
  href: string;
  // What it points at, for the title. The label says what the thing is; this says which one.
  title: string;
}

// One thing an agent produced, as a tile down the right edge of its row. A squircle rather than a
// circle so a row of them lines up as a column of equal blocks — `rounded-[30%]` on a square is
// close enough to a superellipse at this size, and needs no clip path.
//
// An `<a>` because it points somewhere, and it carries no click handler: the row keeps out of the
// way with `isLinkClick` instead, since a `stopPropagation()` here would also stop the event
// reaching the listener that opens the link — see `link-click.ts`.
//
// A left click is all it has. VS Code's webview preventDefaults middle-click on any link, and the
// right-click belongs to the row's own menu — so the tile is not a link with a link's full menu.
export const AgentSquircle = ({ icon: Icon, label, href, title }: AgentSquircleProps) => (
  <a
    href={href}
    aria-label={`${label} — ${title}`}
    title={title}
    target="_blank"
    rel="noreferrer"
    className="flat-focus flex size-12 shrink-0 items-center justify-center rounded-[30%] border border-border bg-card text-muted-foreground transition-colors hover:border-link hover:text-link"
  >
    <Icon className="size-5" />
  </a>
);
