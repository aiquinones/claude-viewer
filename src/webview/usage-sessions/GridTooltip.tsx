import { ReactNode } from 'react';

// How near an edge a square has to be before the bubble stops centring on it. Three columns is
// about half the width of the longest thing it says.
const EDGE_COLUMNS: number = 3;

interface GridTooltipProps {
  // Which square it points at, as lattice indices. The grid is a fixed pitch, so the position is
  // arithmetic — nothing here measures the DOM, and the tooltip can't disagree with the square.
  week: number;
  row: number;
  // How many columns there are, so the bubble knows when it's near an end.
  weeks: number;
  children: ReactNode;
}

// One tooltip for the whole grid, moved to whichever square the pointer is on. Not `Tooltip` and
// not a hover card per square: there are several hundred squares, and both components that already
// exist here put a bubble in the DOM per trigger.
//
// It sits above the square, inside the scrolling track rather than over it, so it travels with the
// grid instead of hanging still while the columns move underneath.
export const GridTooltip = ({ week, row, weeks, children }: GridTooltipProps) => {
  // Centred everywhere except within a few columns of either end, where half a bubble would hang
  // outside the scroll box and be clipped. The scroll box crops rather than extends, so this is the
  // difference between a readable date and half of one.
  const align: string =
    week < EDGE_COLUMNS
      ? 'translate-x-0'
      : week >= weeks - EDGE_COLUMNS
        ? '-translate-x-full'
        : '-translate-x-1/2';

  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute z-20 -translate-y-full whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md ${align}`}
      style={{
        // Half a cell over puts it on the square's centre; the row's own top is where it stops.
        left: `calc(var(--grid-pitch) * ${week} + var(--grid-cell) / 2)`,
        top: `calc(var(--grid-pitch) * ${row} - 0.25rem)`
      }}
    >
      {children}
    </div>
  );
};
