import { ReactNode } from 'react';
import { Z } from '@/z-layers';

// How much room the bubble needs on one side of a square before it will centre on it. About half
// the width of the card's widest line, which is the date — "Wednesday, December 3".
const EDGE_PX: number = 120;

// The air between the square and the bottom of the bubble.
const GAP_PX: number = 4;

interface GridTooltipProps {
  // Where the square is, in pixels from the top-left of the grid frame. Measured off the square
  // when the pointer arrives rather than derived from the lattice: the squares scroll and the frame
  // doesn't, so a column index says nothing about where a square actually is on screen.
  x: number;
  y: number;
  // How wide the frame is, which is what decides whether the bubble has room to centre.
  frameWidth: number;
  children: ReactNode;
}

// One tooltip for the whole grid, moved to whichever square the pointer is on. Not `Tooltip` and
// not a hover card per square: there are several hundred squares, and both components that already
// exist here put a bubble in the DOM per trigger.
//
// It holds a card rather than a sentence — `GridDaySummary` — so `whitespace-nowrap` here is what
// keeps each of that card's rows on its own line rather than what keeps the bubble to one.
//
// It sits outside the scrolling box and over it. Inside, the box cropped it — the top row's bubble
// lost its upper half to `overflow-y-clip` and the leftmost one went behind the sticky weekday
// column. Out here nothing clips it, so it's free to peek above the grid's own border.
export const GridTooltip = ({ x, y, frameWidth, children }: GridTooltipProps) => {
  // Centred unless it's within half a bubble of either end of the *visible* frame, where centring
  // would push it past the panel — which does crop, `overflow-x-clip` being what holds the surface
  // to its width.
  const align: string =
    x < EDGE_PX
      ? 'translate-x-0'
      : x > frameWidth - EDGE_PX
        ? '-translate-x-full'
        : '-translate-x-1/2';

  return (
    <div
      role="tooltip"
      style={{ zIndex: Z.card, left: x, top: y - GAP_PX }}
      className={`pointer-events-none absolute -translate-y-full whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md ${align}`}
    >
      {children}
    </div>
  );
};
