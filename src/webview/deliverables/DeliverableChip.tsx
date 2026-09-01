import { MouseEvent, ReactNode } from 'react';
import { Deliverable } from '../../model/types';
import { cn } from '@/lib/utils';
import { DELIVERABLE_KIND_INFO } from './deliverable-kinds';
import { ChipVariant, chipVariantStyle, DEFAULT_CHIP_VARIANT } from './chip-variants';

interface DeliverableChipProps {
  deliverable: Deliverable;
  // Only a `path` needs this: a `url` is an `<a href>` and VS Code opens it from a listener on the
  // frame's own window, which is the same reason `PullRequestLink` carries no handler.
  onOpen: (deliverable: Deliverable) => void;
  // Which of the six looks to draw. Scaffolding for choosing one — see `chip-variants.ts`.
  variant?: ChipVariant;
}

// One thing a session announced it produced. An `<a>` when it points at a URL and a `<button>` when
// it points at a file — the two behave differently enough that faking one with the other costs more
// than drawing both.
//
// Either way it sits outside the row's own button, which is what `AgentRowFooter` is for: a
// `<button>` can hold neither an `<a>` nor another button.
export const DeliverableChip = ({
  deliverable,
  onOpen,
  variant = DEFAULT_CHIP_VARIANT
}: DeliverableChipProps) => {
  const { label, Icon, color } = DELIVERABLE_KIND_INFO[deliverable.kind];
  const style = chipVariantStyle(variant);
  // Through `cn` rather than a template string: the variant's own text color has to beat the base
  // one, and two utilities on one property otherwise resolve by whichever Tailwind emitted first.
  const className: string = cn(CHIP_CLASS, style.root(color));

  const body: ReactNode = (
    <>
      {style.rail && <span className={cn('h-3.5 w-0.5 shrink-0 rounded-full', style.rail(color))} />}
      {style.icon && <Icon className={cn('size-3.5 shrink-0', style.icon(color))} />}
      {style.showKind && (
        <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
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
        className={className}
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
      className={className}
    >
      {body}
    </button>
  );
};

// Shared so the two shapes are one chip. `max-w-48` and the truncate keep a long title from pushing
// the rest of the row off — an agent writes these, and nothing caps what it writes.
const CHIP_CLASS: string =
  'mono flex w-fit min-w-0 max-w-48 shrink-0 cursor-pointer items-center gap-1.5 text-xs';
