import { MouseEvent } from 'react';
import { Deliverable } from '../../model/types';
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
  const { label, Icon } = DELIVERABLE_KIND_INFO[deliverable.kind];
  const text: string = deliverable.title;

  if (deliverable.url) {
    return (
      <a
        href={deliverable.url}
        title={`${label} — ${deliverable.url}`}
        target="_blank"
        rel="noreferrer"
        className={CHIP_CLASS}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{text}</span>
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
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{text}</span>
    </button>
  );
};

// Shared so the two shapes are one chip. `max-w-48` and the truncate keep a long title from pushing
// the rest of the row off — an agent writes these, and nothing caps what it writes.
const CHIP_CLASS: string =
  'mono flex w-fit min-w-0 max-w-48 shrink-0 cursor-pointer items-center gap-1.5 ' +
  'text-xs text-link hover:underline';
