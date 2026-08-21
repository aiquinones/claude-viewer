import { useEffect, useRef, useState } from 'react';
import { DAYS_PER_WEEK, GridDay, GridMetric, GridWeek, UsageGrid, gridDayLabel } from './grid';
import { GridLegend } from './GridLegend';
import { gridDayValue } from './grid-labels';

interface ContributionGridProps {
  grid: UsageGrid;
  metric: GridMetric;
}

// Which rows carry a weekday name. All seven would need a row height nobody wants; these three are
// what GitHub prints, and they're enough to tell which end of the week you're looking at.
const WEEKDAY: Record<number, string> = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

// A year of days, one square each, in Sunday-to-Saturday columns. 53 columns is wider than a narrow
// panel, so the box scrolls sideways and opens at today — the end everyone reads first.
export const ContributionGrid = ({ grid, metric }: ContributionGridProps) => {
  const scroller = useRef<HTMLDivElement>(null);
  // What the readout above the grid says while a square is under the pointer. One line for the whole
  // grid rather than a hover card per square, of which there would be 371.
  const [hovered, setHovered] = useState<GridDay | undefined>(undefined);

  // Today is in the last column, and the last column is the one worth landing on.
  useEffect(() => {
    const element: HTMLDivElement | null = scroller.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, []);

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
        {hovered ? (
          <>
            <span className="text-foreground">{gridDayValue(hovered, metric)}</span> ·{' '}
            {gridDayLabel(hovered)}
          </>
        ) : (
          summary(grid, metric)
        )}
      </p>

      <div ref={scroller} className="overflow-x-auto overflow-y-clip pb-1">
        <div className="flex w-max gap-1">
          {/* Sticky, because the box opens scrolled to today: a column that scrolled with the
              squares would be off the left edge from the moment the grid is drawn. */}
          <div className="sticky left-0 z-10 mt-4 flex shrink-0 flex-col gap-0.5 bg-background pr-1">
            {Array.from({ length: DAYS_PER_WEEK }, (_, row) => (
              <span
                key={row}
                className="h-2.5 w-6 text-[9px] leading-[0.625rem] text-muted-foreground"
              >
                {WEEKDAY[row] ?? ''}
              </span>
            ))}
          </div>

          {grid.weeks.map((week: GridWeek) => (
            <div key={week.key} className="flex shrink-0 flex-col gap-0.5">
              <span className="h-4 text-[9px] leading-4 text-muted-foreground">
                {week.month ?? ''}
              </span>
              {week.days.map((day: GridDay) => (
                <span
                  key={day.day}
                  // A square is data, not a control: only the sessions under it are clickable. The
                  // native title is what makes it readable without 371 hover cards.
                  title={
                    day.future
                      ? undefined
                      : `${gridDayValue(day, metric)} · ${gridDayLabel(day)}`
                  }
                  onPointerEnter={() => setHovered(day.future ? undefined : day)}
                  onPointerLeave={() => setHovered(undefined)}
                  className={day.future ? 'usage-grid-future' : `usage-grid-day level-${day.level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <GridLegend />
    </section>
  );
};

// What the readout says when nothing is hovered: the span, and how much of it was worked.
const summary = (grid: UsageGrid, metric: GridMetric): string =>
  grid.activeDays === 0
    ? 'No sessions on record in the last year.'
    : `${metric === 'tokens' ? 'Output tokens' : 'Sessions'} per day · ${grid.activeDays} active ${
        grid.activeDays === 1 ? 'day' : 'days'
      }`;
