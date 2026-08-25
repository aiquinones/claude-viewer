import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { cardDrop, CardDrop, clipBoxOf } from './hover-drop';
import { Z } from './z-layers';

// How much room the bubble needs on one side of its target before it will centre on it. About half
// the width of its widest line — a grid square's date, "Wednesday, December 3", or a turn's readout.
const EDGE_PX: number = 120;

// The air between the target and the near edge of the bubble.
const GAP_PX: number = 4;

interface HoverBubbleProps {
  // Where the target is, in pixels from the top-left of the frame that holds this. Measured off the
  // element when the pointer arrives rather than derived from an index: the content scrolls and the
  // frame doesn't, so a column number says nothing about where anything is on screen.
  x: number;
  y: number;
  // How wide the frame is, which is what decides whether the bubble has room to centre.
  frameWidth: number;
  children: ReactNode;
}

// One bubble for a whole grid of things, moved to whichever the pointer is on. Not `Tooltip` and not
// a hover card per item: the contribution grid has several hundred squares and a long session has as
// many turns, and both components that already exist here put a bubble in the DOM per trigger.
//
// What it holds can be rows rather than a sentence — the grid's `GridDaySummary` is, and so is a
// turn that loaded several skills — so `whitespace-nowrap` here keeps each of those rows on its own
// line rather than the bubble to one.
//
// It sits outside the scrolling box and over it. Inside, the box cropped it — the top row's bubble
// lost its upper half to `overflow-y-clip` and the leftmost one went behind the sticky weekday
// column. Out here nothing clips it until the pane, so it's free to peek above the frame's own
// border.
export const HoverBubble = ({ x, y, frameWidth, children }: HoverBubbleProps) => {
  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [drop, setDrop] = useState<CardDrop>('up');

  // Measured rather than taken from a constant, for the reason `useCardDrop` measures: what's in
  // here is the caller's, and a turn that loaded six skills is four times the height of one that
  // loaded none. `setState` bails on an unchanged value, so this settles in one extra render.
  useLayoutEffect(() => {
    const node: HTMLDivElement | null = box.current;
    if (node) setHeight(node.getBoundingClientRect().height);
  });

  // Which end it opens toward, against the pane rather than the frame — the frame is what it's
  // allowed to peek out of, the pane is what actually cuts it off. Only re-run when the target moves
  // or the content changes size, since climbing for the clip box reads a computed style per
  // ancestor and the pointer moves far more often than either.
  useLayoutEffect(() => {
    const node: HTMLDivElement | null = box.current;
    if (!node || height === 0) return;

    const parent: Element | null = node.offsetParent;
    const top: number = (parent ? parent.getBoundingClientRect().top : 0) + y;
    setDrop(cardDrop({ trigger: { top, bottom: top }, cardHeight: height, clip: clipBoxOf(node) }));
  }, [height, y]);

  // Centred unless it's within half a bubble of either end of the *visible* frame, where centring
  // would push it past the panel — which does crop, `overflow-x-clip` being what holds the surface
  // to its width.
  const align: string =
    x < EDGE_PX
      ? 'translate-x-0'
      : x > frameWidth - EDGE_PX
        ? '-translate-x-full'
        : '-translate-x-1/2';

  const up: boolean = drop === 'up';

  return (
    <div
      ref={box}
      role="tooltip"
      style={{ zIndex: Z.card, left: x, top: up ? y - GAP_PX : y + GAP_PX }}
      className={`pointer-events-none absolute whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md ${align} ${up ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {children}
    </div>
  );
};
