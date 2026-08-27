import { useMemo } from 'react';
import { hasCost, NO_COST_REASON } from '../../model/usage/cost-unit';
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

  // The CLI states no per-token cost, so there are no points — but there were requests, and the
  // context chart below draws them. The note counts the turns rather than the points, or a session
  // that plainly ran would be captioned "0 requests".
  const priced: boolean = hasCost(detail.tool);

  return (
    <ChartSection
      // "Cost", not "Turns" — the curve's height is what you came to read, and the count of
      // requests behind it is already the note beside this.
      title="Cost"
      note={
        <>
          {plural(priced ? points.length : detail.turns.length, 'request')}
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
        empty={priced ? EMPTY_TURNS : NO_COST_REASON}
      />
    </ChartSection>
  );
};
