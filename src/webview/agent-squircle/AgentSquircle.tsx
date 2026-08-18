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
// An `<a>`, so the middle-click and the copy-link-address a link is expected to have both work. It
// stops its own click bubbling: the row opens the transcript, and following a PR would otherwise
// open a file behind the browser it just opened.
export const AgentSquircle = ({ icon: Icon, label, href, title }: AgentSquircleProps) => (
  <a
    href={href}
    aria-label={`${label} — ${title}`}
    title={title}
    target="_blank"
    rel="noreferrer"
    onClick={(event) => event.stopPropagation()}
    className="flat-focus flex size-9 shrink-0 items-center justify-center rounded-[30%] border border-border bg-card text-muted-foreground transition-colors hover:border-link hover:text-link"
  >
    <Icon className="size-4" />
  </a>
);
