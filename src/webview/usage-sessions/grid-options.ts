// The grid's own toggle. Same control as the metric switch on the Skills tab and the same kind of
// choice — two readings of one set of days — but not the same options: this one picks between how
// much was spent and how many sessions did the spending, where that one picks between tokens and
// money.

import { ChoiceOption } from '../UsageChoice';
import { GRID_METRICS, GridMetric } from './grid';
import { GRID_METRIC_LABEL } from './grid-labels';

const HINT: Record<GridMetric, string> = {
  tokens: 'Output tokens produced that day, across every session.',
  sessions: 'How many sessions were active that day, whatever they cost.'
};

export const GRID_METRIC_OPTIONS: readonly ChoiceOption<GridMetric>[] = GRID_METRICS.map(
  (metric) => ({
    id: metric,
    label: GRID_METRIC_LABEL[metric],
    hint: HINT[metric]
  })
);
