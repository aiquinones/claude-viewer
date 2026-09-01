import { MouseEvent, ReactNode } from 'react';
import { Deliverable } from '../../model/types';
import { cn } from '@/lib/utils';
import { DELIVERABLE_KIND_INFO } from './deliverable-kinds';

interface DeliverableChipProps {
  deliverable: Deliverable;
  // Only a `path` needs this: a `url` is an `<a href>` and VS Code opens it from a listener on the
  // frame's own window, which is the same reason `PullRequestLink` carries no handler.
  onOpen: (deliverable: Deliverable) => void;
}

// One thing a session announced it produced. An `<a>` when it points at a URL and a `<button>` when
// it points at a file — the two behave differently enough that faking one with the other costs more
// than drawing both.
//
// Either way it sits outside the row's own button, which is what `AgentRowFooter` is for: a
// `<button>` can hold neither an `<a>` nor another button.
export const DeliverableChip = ({ deliverable, onOpen }: DeliverableChipProps) => {
  const { label, Icon, color } = DELIVERABLE_KIND_INFO[deliverable.kind];

  const body: ReactNode = (
    <>
      <Icon className={cn('size-3.5 shrink-0', color)} />
      <span className="truncate">{deliverable.title}</span>
    </>
  );

  if (deliverable.url) {
    return (
      <a
        href={deliverable.url}
        title={`${label} — ${deliverable.url}`}
        target="_blank"
        rel="noreferrer"
        className={CHIP_CLASS}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      title={`${label} — ${deliverable.path}`}
      // The row's own click opens the agent, and this is inside it. `isLinkClick` can't help here —
      // that reads an `<a href>`, and this is a button — so it stops its own bubble, which is safe
      // because nothing above needs the event.
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
        onOpen(deliverable);
      }}
      className={CHIP_CLASS}
    >
      {body}
    </button>
  );
};

// Shared so the two shapes are one chip. `max-w-48` and the truncate keep a long title from pushing
// the rest of the row off — an agent writes these, and nothing caps what it writes.
//
// A bordered box rather than a link: the color that identifies a kind is in the icon, so the title
// has to read as text — blue title plus a pink mark was two claims about the same chip.
const CHIP_CLASS: string =
  'mono flex w-fit min-w-0 max-w-48 shrink-0 cursor-pointer items-center gap-1.5 rounded-md ' +
  'border border-border px-2 py-0.5 text-xs text-foreground transition-colors hover:bg-accent';
