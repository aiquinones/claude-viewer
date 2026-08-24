import { useMemo } from 'react';
import { ContextReading, readContext } from '../../model/sessions/context';
import { ContextPoint, SessionDetail } from '../../model/usage/types';
import { budgetTextClass } from '../BudgetBar';
import { formatContextTokens } from '../format-size';
import { useSettings } from '../settings/SettingsContext';
import { ChartSection } from './charts/ChartSection';
import { EMPTY_CONTEXT } from './charts/chart-labels';
import { ChartGuide, contextGuides, contextMax } from './charts/context-guides';
import { LoadPoint, peakOf, SeriesPoint, toContextSeries, toLoadPoints } from './charts/series';
import { SessionChart } from './charts/SessionChart';

interface ContextSectionProps {
  detail: SessionDetail;
}

// How full the context got, request by request. It grows, because every turn re-reads the whole
// conversation — and where it doesn't, something compacted it, which is exactly the shape worth
// being able to see.
//
// The two thresholds are drawn across it as rules. They come out of the same `readContext` the agent
// row's bar uses, so a session that reads yellow on that surface reads yellow here.
export const ContextSection = ({ detail }: ContextSectionProps) => {
  const settings = useSettings().context;

  const points: SeriesPoint[] = useMemo(() => toContextSeries(detail.contexts), [detail]);
  const loads: LoadPoint[] = useMemo(
    () => toLoadPoints({ points, invocations: detail.invocations }),
    [points, detail]
  );

  // The last request is what the session is carrying now, which is the figure the agent surface
  // shows for a live one. The peak is on the chart.
  const last: ContextPoint | undefined = detail.contexts[detail.contexts.length - 1];
  const reading: ContextReading | undefined = last
    ? readContext({ context: last, settings })
    : undefined;

  const max: number = reading
    ? contextMax({ reading, peak: peakOf(points) })
    : peakOf(points);
  const guides: ChartGuide[] = reading ? contextGuides({ reading, max }) : [];

  return (
    <ChartSection title="Context" note={reading && <Note reading={reading} />}>
      <SessionChart
        points={points}
        loads={loads}
        guides={guides}
        max={max}
        unit="context"
        format={formatContextTokens}
        empty={EMPTY_CONTEXT}
      />
    </ChartSection>
  );
};

interface NoteProps {
  reading: ContextReading;
}

// Where the session ended up, against the window assumed for its model — the same sentence the agent
// row's card leads with, in the same colour.
const Note = ({ reading }: NoteProps) => (
  <>
    <span className={`tabular-nums ${budgetTextClass(reading.level)}`}>
      {formatContextTokens(reading.tokens)} of {formatContextTokens(reading.window.tokens)}
    </span>
    {reading.model && <span className="mono"> · {reading.model}</span>}
  </>
);
