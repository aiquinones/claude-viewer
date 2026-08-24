import { useMemo } from 'react';
import { SessionDetail, UsageCostBasis, UsageMetric } from '../../model/usage/types';
import { plural } from '../format-size';
import { METRIC_LABEL } from '../usage-format';
import { ChartSection } from './charts/ChartSection';
import { EMPTY_TURNS } from './charts/chart-labels';
import { LoadPoint, peakOf, SeriesPoint, toLoadPoints, toMetricSeries } from './charts/series';
import { SessionChart } from './charts/SessionChart';
import { formatValue } from './session-format';

interface MetricSectionProps {
  detail: SessionDetail;
  metric: UsageMetric;
  costBasis: UsageCostBasis;
}

// What each request cost, over the session's own turns rather than over a window. Scaled to its own
// peak: there is no threshold at which a turn is too expensive, so the only thing worth reading off
// the height is which requests were the big ones.
export const MetricSection = ({ detail, metric, costBasis }: MetricSectionProps) => {
  const points: SeriesPoint[] = useMemo(
    () => toMetricSeries({ turns: detail.turns, metric, costBasis }),
    [detail, metric, costBasis]
  );

  const loads: LoadPoint[] = useMemo(
    () => toLoadPoints({ points, invocations: detail.invocations }),
    [points, detail]
  );

  return (
    <ChartSection
      title="Turns"
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
        unit={METRIC_LABEL[metric].toLowerCase()}
        format={(value) => formatValue({ value, metric, tool: detail.tool })}
        empty={EMPTY_TURNS}
      />
    </ChartSection>
  );
};
