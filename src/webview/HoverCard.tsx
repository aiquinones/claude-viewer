import { ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import { Z } from './z-layers';

interface HoverCardProps {
  // What the card says — a heading and a paragraph, usually. Not a label: `Tooltip` is the one for
  // those, and it's `whitespace-nowrap` because it holds a label and a key cap.
  card: ReactNode;
  // Extra classes for the wrapper. A name in a row has to be allowed to shrink; a chip in a
  // wrapping row must not.
  className?: string;
  // A card you can reach with the pointer. Off by default, because a label that swallows clicks
  // meant for whatever it's floating over is worse than one you can't press — turn it on only when
  // the card holds something to press, and the group's hover is what keeps it open on the way there.
  interactive?: boolean;
  children: ReactNode;
}

// A wrapping hover card on whatever it's given. The mechanics only — hover, keyboard focus, a box
// that opens below, and the side it opens toward — so everything that explains itself this way
// shares one implementation and none of them owns it.
export const HoverCard = ({
  card,
  className = '',
  interactive = false,
  children
}: HoverCardProps) => {
  const trigger = useRef<HTMLSpanElement>(null);
  const { side, measure } = useCardSide(trigger);

  return (
    <span
      ref={trigger}
      onPointerEnter={measure}
      onFocus={measure}
      className={`group relative inline-flex ${className}`}
    >
      {children}

      {/* An interactive card is not a tooltip and mustn't be announced as one — a screen reader
          would read the button inside it as part of the label. `invisible` rather than
          `pointer-events-none` there: the card has to take the pointer once it's open, and nothing
          but visibility keeps it out of the tab order while it's closed.

          `pt-1` rather than a margin, so the gap under the trigger is still inside the group — with
          a margin the pointer leaves the group crossing it and the card shuts on the way to it.

          Every card takes the `card` layer, with no way to ask for less: these hang off rows that
          sit above a pane's pinned bar and drop down across it, so a card that didn't clear the
          whole pinned stack would go behind the markdown body under it. */}
      <span
        role={interactive ? undefined : 'tooltip'}
        style={{ zIndex: Z.card }}
        className={`absolute top-full pt-1 opacity-0 transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100 ${
          interactive
            ? 'invisible group-hover:visible group-has-focus-visible:visible'
            : 'pointer-events-none'
        } ${side === 'end' ? 'right-0' : 'left-0'}`}
      >
        {/* `w-max` with a max: a two-word hint gets a small box and a paragraph wraps at 16rem,
            rather than every card being the width of the longest one.

            The typography is reset, not inherited. A card floats out of wherever its trigger was
            mounted — the retention (i) sits inside a `font-semibold uppercase tracking-wide`
            heading, and its whole explanation came out in the heading's face while the identical
            card on a plain toggle beside it did not. `HoverCardTitle` puts its own weight back. */}
        <span className="block w-max max-w-[min(16rem,calc(100vw-1.5rem))] rounded-md border border-border bg-popover p-2 text-xs font-normal normal-case leading-relaxed tracking-normal text-popover-foreground shadow-lg">
          {card}
        </span>
      </span>
    </span>
  );
};

// The card's widest it can be, in pixels, for deciding which way it opens. A rem here rather than a
// measurement of the card itself: the card is only in the layout while it's open, so measuring it is
// measuring the previous hover.
const MAX_CARD_PX: number = 16 * 16;

// How close to the panel edge is too close.
const EDGE_MARGIN_PX: number = 12;

interface CardSide {
  side: 'start' | 'end';
  measure: () => void;
}

// Which way the card opens, decided when the pointer arrives. A card pinned to one side is cut off
// by the panel as soon as its trigger is near that edge — and in a webview the panel *is* the
// viewport, so this is a question about a dock width rather than about a screen.
const useCardSide = (trigger: RefObject<HTMLSpanElement | null>): CardSide => {
  const [side, setSide] = useState<'start' | 'end'>('start');

  const measure = useCallback((): void => {
    const rect: DOMRect | undefined = trigger.current?.getBoundingClientRect();
    if (!rect) return;

    // Opening left-aligned needs room to the right, and vice versa. Where neither side fits it
    // stays put and clips — that's a panel narrower than the card.
    const fitsStart: boolean = rect.left + MAX_CARD_PX <= window.innerWidth - EDGE_MARGIN_PX;
    setSide(fitsStart || rect.right - MAX_CARD_PX < EDGE_MARGIN_PX ? 'start' : 'end');
  }, [trigger]);

  return { side, measure };
};

interface HoverCardTitleProps {
  children: ReactNode;
  // Names are set in the mono face; a plain heading isn't.
  mono?: boolean;
}

export const HoverCardTitle = ({ children, mono = false }: HoverCardTitleProps) => (
  <span className={`block font-semibold text-foreground ${mono ? 'mono' : ''}`}>{children}</span>
);

export const HoverCardBody = ({ children }: { children: ReactNode }) => (
  <span className="mt-1 block text-muted-foreground">{children}</span>
);
