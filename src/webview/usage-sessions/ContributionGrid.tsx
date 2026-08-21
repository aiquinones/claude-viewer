import { useEffect, useRef, useState } from 'react';
import { DAYS_PER_WEEK, GridDay, GridMetric, GridWeek, UsageGrid } from './grid';
import { GridLegend } from './GridLegend';
import { GridTooltip } from './GridTooltip';
import { gridDayLabel, gridDayValue } from './grid-labels';

interface ContributionGridProps {
  grid: UsageGrid;
  metric: GridMetric;
}

// Which rows carry a weekday name. All seven would need a row height nobody wants; these three are
// what GitHub prints, and they're enough to tell which end of the week you're looking at.
const WEEKDAY: Record<number, string> = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

// Which square the pointer is on. The indices are what places the tooltip — the grid is a fixed
// lattice, so a square's position is arithmetic rather than something to measure.
interface Hovered {
  day: GridDay;
  week: number;
  row: number;
}

// One square per day, in Sunday-to-Saturday columns. Wider than a narrow panel, so the box scrolls
// sideways and opens at today — the end everyone reads first.
//
// The lattice is laid out from one pitch: `--grid-cell` plus `--grid-gap`, both set in styles.css.
// Everything else here positions against it. That matters because the month labels and the tooltip
// are *absolute* — a label placed in its column's flow makes that column as wide as the word, which
// is a visible gap every four weeks, and a tooltip in the flow would do the same.
export const ContributionGrid = ({ grid, metric }: ContributionGridProps) => {
  const scroller = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Hovered | undefined>(undefined);

  // Today is in the last column, and the last column is the one worth landing on.
  useEffect(() => {
    const element: HTMLDivElement | null = scroller.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, []);

  return (
    <section className="usage-grid flex flex-col gap-2 rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{summary(grid, metric)}</p>

      <div ref={scroller} className="overflow-x-auto overflow-y-clip pb-1">
        <div className="flex w-max gap-1">
          {/* Sticky, because the box opens scrolled to today: a column that scrolled with the
              squares would be off the left edge from the moment the grid is drawn. */}
          {/* `mt-4` clears the month row, so these line up with the squares rather than with the
              top of the grid area. */}
          <div className="usage-grid-days sticky left-0 z-10 mt-4 flex shrink-0 flex-col bg-background pr-1">
            {Array.from({ length: DAYS_PER_WEEK }, (_, row) => (
              <span key={row} className="usage-grid-weekday">
                {WEEKDAY[row] ?? ''}
              </span>
            ))}
          </div>

          <div className="relative">
            {/* Absolute, so a month name is free to run over the columns beside it — which is what
                gives the labels their two-to-three-column span without moving a single square. */}
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

            {/* Its own positioned box, so the tooltip's `top` is measured from the first row of
                squares rather than from the month labels above them. */}
            <div className="relative">
              <div className="usage-grid-weeks flex" onPointerLeave={() => setHovered(undefined)}>
                {grid.weeks.map((week: GridWeek, weekIndex: number) => (
                  <div key={week.key} className="usage-grid-days flex shrink-0 flex-col">
                    {week.days.map((day: GridDay, row: number) => (
                      <span
                        key={day.day}
                        // A square is data, not a control — only the sessions under it are
                        // clickable. No `title`: the tooltip says the same thing without the delay,
                        // and both at once reads as the page stuttering. The label is what a screen
                        // reader gets instead.
                        aria-label={day.future ? undefined : tooltipText(day, metric)}
                        onPointerEnter={() =>
                          setHovered(day.future ? undefined : { day, week: weekIndex, row })
                        }
                        className={
                          day.future ? 'usage-grid-future' : `usage-grid-day level-${day.level}`
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>

              {hovered && (
                <GridTooltip week={hovered.week} row={hovered.row} weeks={grid.weeks.length}>
                  {tooltipText(hovered.day, metric)}
                </GridTooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      <GridLegend />
    </section>
  );
};

// What one square says. "on <date>" rather than a separator, so it reads as a sentence the way
// GitHub's does — the date is the subject, not a second field.
const tooltipText = (day: GridDay, metric: GridMetric): string =>
  `${gridDayValue(day, metric)} on ${gridDayLabel(day)}`;

// The caption above the grid. Static — it names what the squares measure and how much of the span
// was worked, and it stays put while you move over the grid: the hovered day is the tooltip's job.
const summary = (grid: UsageGrid, metric: GridMetric): string =>
  grid.activeDays === 0
    ? 'No sessions on record in this window.'
    : `${metric === 'tokens' ? 'Output tokens' : 'Sessions'} per day · ${grid.activeDays} active ${
        grid.activeDays === 1 ? 'day' : 'days'
      }`;
