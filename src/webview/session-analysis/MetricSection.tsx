import { useMemo } from 'react';
import { SessionDetail, UsageMetric } from '../../model/usage/types';
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
}

// What each request cost, over the session's own turns rather than over a window. Scaled to its own
// peak: there is no threshold at which a turn is too expensive, so the only thing worth reading off
// the height is which requests were the big ones.
export const MetricSection = ({ detail, metric }: MetricSectionProps) => {
  const points: SeriesPoint[] = useMemo(
    () => toMetricSeries({ turns: detail.turns, metric }),
    [detail, metric]
  );

  const loads: LoadPoint[] = useMemo(
    () => toLoadPoints({ points, invocations: detail.invocations }),
    [points, detail]
  );

  return (
    <ChartSection
      // The metric, not "Turns" — the curve's height is what you came to read, and the count of
      // requests behind it is already the note beside this.
      title={METRIC_LABEL[metric]}
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
