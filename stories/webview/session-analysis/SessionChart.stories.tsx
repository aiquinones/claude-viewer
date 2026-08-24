import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { readContext } from '@src/model/sessions/context';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { contextGuides, contextMax } from '@src/webview/session-analysis/charts/context-guides';
import {
  peakOf,
  toContextSeries,
  toLoadPoints,
  toMetricSeries
} from '@src/webview/session-analysis/charts/series';
import { SessionChart } from '@src/webview/session-analysis/charts/SessionChart';
import { formatContextTokens } from '@src/webview/format-size';
import { surfaceAccent } from '@src/webview/surfaces';
import { formatUsageTokens } from '@src/webview/usage-format';
import { claudeDetail, copilotDetail } from '../../session-detail-fixtures';

// Run through the real builders rather than written out by hand, so the curve, the dots and the
// bubble agree with each other the way they do in the panel.
const points = toMetricSeries({
  turns: claudeDetail.turns,
  metric: 'output-tokens',
  costBasis: 'all'
});

const loads = toLoadPoints({ points, invocations: claudeDetail.invocations });

const meta: Meta<typeof SessionChart> = {
  title: 'Usage/SessionChart',
  component: SessionChart,
  args: {
    points,
    loads,
    max: peakOf(points),
    unit: 'output tokens',
    format: formatUsageTokens,
    empty: 'No requests recorded for this session.'
  },
  decorators: [
    (Story) => (
      <div
        className="w-[42rem] max-w-full p-4"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionChart>;

// Fifty-odd requests, with a pulsing dot wherever a skill's body entered the context. Hovering
// anywhere on the plot snaps to the nearest one; a dot's own point says which skill was called.
export const Session: Story = {};

// Short enough that the labels under the axis stop thinning out and every point gets one.
export const Short: Story = {
  args: (() => {
    const short = points.slice(0, 8);
    return {
      points: short,
      loads: toLoadPoints({ points: short, invocations: claudeDetail.invocations }),
      max: peakOf(short)
    };
  })()
};

// One request. It sits in the middle rather than on the left edge, where a lone point reads as the
// start of a line that got cut off.
export const SinglePoint: Story = {
  args: { points: points.slice(0, 1), loads: [], max: peakOf(points.slice(0, 1)) }
};

// The context series and its two thresholds — the shape the ContextSection draws. The rules are
// dashed and labelled where the grid behind them is solid and faint, so which lines mean something
// doesn't have to be worked out.
export const WithGuides: Story = {
  args: (() => {
    const series = toContextSeries(claudeDetail.contexts);
    const reading = readContext({
      context: claudeDetail.contexts[claudeDetail.contexts.length - 1],
      settings: { ...DEFAULT_SETTINGS.context, warnAt: { value: 60_000, source: 'user' } }
    });
    const max = contextMax({ reading, peak: peakOf(series) });

    return {
      points: series,
      loads: toLoadPoints({ points: series, invocations: claudeDetail.invocations }),
      guides: contextGuides({ reading, max }),
      max,
      unit: 'context',
      format: formatContextTokens
    };
  })()
};

// Copilot's double load — two `skill.invoked` events five seconds apart for one typed command —
// lands on one point and draws one dot. Two dots a pixel apart would read as two places in the
// session.
export const CopilotDoubleLoad: Story = {
  args: (() => {
    const series = toMetricSeries({
      turns: copilotDetail.turns,
      metric: 'output-tokens',
      costBasis: 'all'
    });
    return {
      points: series,
      loads: toLoadPoints({ points: series, invocations: copilotDetail.invocations }),
      max: peakOf(series)
    };
  })()
};

// No requests at all — a session directory that exists and never got prompted.
export const Empty: Story = { args: { points: [], loads: [], max: 0 } };
