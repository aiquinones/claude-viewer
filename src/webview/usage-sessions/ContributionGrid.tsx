import { useEffect, useRef, useState } from 'react';
import { DAYS_PER_WEEK, GridDay, GridWeek, UsageGrid } from './grid';
import { GridLegend } from './GridLegend';
import { HoverBubble } from '../HoverBubble';
import { gridDayLabel, gridDayValue } from './grid-labels';
import { Z } from '@/z-layers';

interface ContributionGridProps {
  grid: UsageGrid;
}

// Which rows carry a weekday name. All seven would need a row height nobody wants; these three are
// what GitHub prints, and they're enough to tell which end of the week you're looking at.
const WEEKDAY: Record<number, string> = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

// Which square the pointer is on, and where the bubble for it goes.
interface Hovered {
  day: GridDay;
  // Pixels from the frame's top-left. The lattice arithmetic still says where a square sits in the
  // grid, but the grid scrolls inside a frame that doesn't — so where it is *on screen* is a
  // measurement, taken off the square itself when the pointer arrives.
  x: number;
  y: number;
  // The frame's width at that moment, which is what decides whether the bubble can centre.
  frameWidth: number;
}

interface HoverArgs {
  day: GridDay;
  square: HTMLElement;
  frame: HTMLElement | null;
}

// One square per day, in Sunday-to-Saturday columns. Wider than a narrow panel, so the box scrolls
// sideways and opens at today — the end everyone reads first.
//
// The lattice is laid out from one pitch: `--grid-cell` plus `--grid-gap`, both set in styles.css.
// Everything else here positions against it. That matters because the month labels are *absolute* —
// a label placed in its column's flow makes that column as wide as the word, which is a visible gap
// every four weeks. The tooltip is the one thing that doesn't follow the pitch: it lives outside the
// scrolling box, so it's placed against the frame rather than against the lattice.
export const ContributionGrid = ({ grid }: ContributionGridProps) => {
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Hovered | undefined>(undefined);

  // Today is in the last column, and the last column is the one worth landing on.
  useEffect(() => {
    const element: HTMLDivElement | null = scroller.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, []);

  return (
    <section className="usage-grid flex flex-col gap-2 rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{summary(grid)}</p>

      {/* What the bubble is placed against: the scroller's box, without its scrolling and without
          its cropping. The tooltip can't hang off the scroller itself — that one crops, which is
          what cut it in half on the top row. */}
      <div ref={frame} className="relative">
        <div
          ref={scroller}
          // A scrolled grid moves the squares out from under a bubble that stays put, and a bubble
          // naming the wrong day is worse than none. The pointer lands on a square again on its
          // next move.
          onScroll={() => setHovered(undefined)}
          className="overflow-x-auto overflow-y-clip pb-1"
        >
          <div className="flex w-max gap-1">
            {/* Sticky, because the box opens scrolled to today: a column that scrolled with the
                squares would be off the left edge from the moment the grid is drawn. */}
            {/* `mt-4` clears the month row, so these line up with the squares rather than with the
                top of the grid area. */}
            <div
              className="usage-grid-days sticky left-0 mt-4 flex shrink-0 flex-col bg-background pr-1"
              style={{ zIndex: Z.raised }}
            >
              {Array.from({ length: DAYS_PER_WEEK }, (_, row) => (
                <span key={row} className="usage-grid-weekday">
                  {WEEKDAY[row] ?? ''}
                </span>
              ))}
            </div>

            <div>
              {/* Absolute, so a month name is free to run over the columns beside it — which is
                  what gives the labels their two-to-three-column span without moving a single
                  square. */}
              <div className="relative h-4">
                {grid.weeks.map((week: GridWeek, index: number) =>
                  week.month ? (
                    <span
                      key={week.key}
                      className="absolute top-0 text-[9px] leading-4 text-muted-foreground"
                      style={{ left: `calc(var(--grid-pitch) * ${index})` }}
                    >
                      {week.month}
                    </span>
                  ) : null
                )}
              </div>

              <div className="usage-grid-weeks flex" onPointerLeave={() => setHovered(undefined)}>
                {grid.weeks.map((week: GridWeek) => (
                  <div key={week.key} className="usage-grid-days flex shrink-0 flex-col">
                    {week.days.map((day: GridDay) => (
                      <span
                        key={day.day}
                        // A square is data, not a control — only the sessions under it are
                        // clickable. No `title`: the tooltip says the same thing without the delay,
                        // and both at once reads as the page stuttering. The label is what a screen
                        // reader gets instead.
                        aria-label={day.future ? undefined : tooltipText(day)}
                        onPointerEnter={(event) =>
                          setHovered(
                            hoverSpot({ day, square: event.currentTarget, frame: frame.current })
                          )
                        }
                        className={
                          day.future ? 'usage-grid-future' : `usage-grid-day level-${day.level}`
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hovered && (
          <HoverBubble x={hovered.x} y={hovered.y} frameWidth={hovered.frameWidth}>
            {tooltipText(hovered.day)}
          </HoverBubble>
        )}
      </div>

      <GridLegend />
    </section>
  );
};

// Where the bubble for a square goes, or nothing at all for a day that hasn't happened. One
// `getBoundingClientRect` per square the pointer enters, which is the only way to know where the
// scrolled lattice currently sits inside the frame.
const hoverSpot = ({ day, square, frame }: HoverArgs): Hovered | undefined => {
  if (day.future || !frame) return undefined;

  const box: DOMRect = frame.getBoundingClientRect();
  const rect: DOMRect = square.getBoundingClientRect();

  return {
    day,
    x: rect.left - box.left + rect.width / 2,
    y: rect.top - box.top,
    frameWidth: box.width
  };
};

// What one square says. "on <date>" rather than a separator, so it reads as a sentence the way
// GitHub's does — the date is the subject, not a second field.
const tooltipText = (day: GridDay): string => `${gridDayValue(day)} on ${gridDayLabel(day)}`;

// The caption above the grid. Static — it names what the squares measure and how much of the span
// was worked, and it stays put while you move over the grid: the hovered day is the tooltip's job.
const summary = (grid: UsageGrid): string =>
  grid.activeDays === 0
    ? 'No sessions on record in this window.'
    : `Sessions per day · ${grid.activeDays} active ${grid.activeDays === 1 ? 'day' : 'days'}`;
