import { RefObject, useCallback, useState } from 'react';

// Which way a hover card opens vertically, and what actually cuts one off. `useCardSide` in
// `HoverCard.tsx` is the horizontal twin, and they're deliberately not one hook: this one measures
// the card it opens, so folding them together would start deciding the drop for all ten components
// `HoverCard` already carries.

export type CardDrop = 'up' | 'down';

// A box's top and bottom edge, in client coordinates. Both a trigger and the thing clipping it.
export interface ClipBox {
  top: number;
  bottom: number;
}

// How close to the clipping box's edge is too close.
const EDGE_MARGIN_PX: number = 8;

interface CardDropArgs {
  trigger: ClipBox;
  cardHeight: number;
  clip: ClipBox;
}

// Up where there's room, down where there isn't. Up is the preference rather than a coin flip,
// because it's what this card already does everywhere it's read today — the flip is for the mount
// point that has no room for it, not a new default.
export const cardDrop = ({ trigger, cardHeight, clip }: CardDropArgs): CardDrop => {
  const above: number = trigger.top - clip.top - EDGE_MARGIN_PX;
  const below: number = clip.bottom - trigger.bottom - EDGE_MARGIN_PX;

  if (cardHeight <= above) return 'up';
  if (cardHeight <= below) return 'down';
  // Neither end holds it, which is a card taller than the pane. Whichever one cuts off less.
  return above >= below ? 'up' : 'down';
};

// The box a floating child is really cut off by: the nearest ancestor that scrolls or clips, or the
// panel itself. A card is `absolute` inside its trigger, so a pane scrolling under a header clips it
// at that header rather than at the top of the panel — which is what makes the panel's own height
// the wrong frame here, where it's the right one for the horizontal rule.
export const clipBoxOf = (element: Element): ClipBox => {
  // `overflowY`, not `overflow`: a pane is `overflow-x-clip` on the axis it doesn't scroll, and
  // clipping sideways says nothing about what happens above and below it.
  for (let node: HTMLElement | null = element.parentElement; node; node = node.parentElement) {
    if (getComputedStyle(node).overflowY !== 'visible') {
      const rect: DOMRect = node.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    }
  }
  return { top: 0, bottom: window.innerHeight };
};

interface CardDropState {
  drop: CardDrop;
  measure: () => void;
}

// Decided when the pointer arrives, the way the side is. The card is measured rather than taken from
// a constant: `invisible` keeps an element in the layout, so its height is readable while it's shut
// — and this one's swings with how many models and cost parts there were to list.
//
// Nothing listens for a scroll under an open card, unlike `useAgentMenu`. A menu opened at a point
// is left pointing at a row that moved; this card stays attached to its trigger, so all a scroll can
// make stale is which end it opens toward, and the next hover measures again.
export const useCardDrop = (
  trigger: RefObject<HTMLElement | null>,
  card: RefObject<HTMLElement | null>
): CardDropState => {
  const [drop, setDrop] = useState<CardDrop>('up');

  const measure = useCallback((): void => {
    const anchor: HTMLElement | null = trigger.current;
    const box: HTMLElement | null = card.current;
    if (!anchor || !box) return;

    const rect: DOMRect = anchor.getBoundingClientRect();
    setDrop(
      cardDrop({
        trigger: { top: rect.top, bottom: rect.bottom },
        cardHeight: box.getBoundingClientRect().height,
        clip: clipBoxOf(anchor)
      })
    );
  }, [trigger, card]);

  return { drop, measure };
};
