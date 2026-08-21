import { GRID_LEVELS } from './grid';

// Less → More, in the same five swatches the grid is painted from. The shades are quartiles by rank
// rather than by size, so the legend deliberately puts no numbers on them: the scale says which days
// were bigger than which, not how big any of them was.
export const GridLegend = () => (
  <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
    <span>Less</span>
    {Array.from({ length: GRID_LEVELS + 1 }, (_, level) => (
      <span key={level} className={`usage-grid-day level-${level}`} />
    ))}
    <span>More</span>
  </div>
);
