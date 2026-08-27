import { useMemo } from 'react';
import { SessionDetail } from '../../model/usage/types';
import { plural } from '../format-size';
import { ChartSection } from './charts/ChartSection';
import { EMPTY_TURNS } from './charts/chart-labels';
import { LoadPoint, peakOf, SeriesPoint, toCostSeries, toLoadPoints } from './charts/series';
import { SessionChart } from './charts/SessionChart';
import { formatCost } from './session-format';

interface CostSectionProps {
  detail: SessionDetail;
}

// What each request cost, over the session's own turns rather than over a window. Scaled to its own
// peak: there is no threshold at which a turn is too expensive, so the only thing worth reading off
// the height is which requests were the big ones.
export const CostSection = ({ detail }: CostSectionProps) => {
  const points: SeriesPoint[] = useMemo(() => toCostSeries(detail.turns), [detail]);

  const loads: LoadPoint[] = useMemo(
    () => toLoadPoints({ points, invocations: detail.invocations }),
    [points, detail]
  );

  return (
    <ChartSection
      // "Cost", not "Turns" — the curve's height is what you came to read, and the count of
      // requests behind it is already the note beside this.
      title="Cost"
      note={
        <>
          {plural(points.length, 'request')}
          {loads.length > 0 && ' · dots are skill loads'}
        </>
      }
    >
      <SessionChart
        points={points}
        loads={loads}
        max={peakOf(points)}
        unit="cost"
        format={(value) => formatCost({ value, tool: detail.tool })}
        empty={EMPTY_TURNS}
      />
    </ChartSection>
  );
};
