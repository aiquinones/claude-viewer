import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageBreakdown } from '@src/model/usage/types';
import { bothClis, dayOfWork } from '../usage-fixtures';
import { UsageSummary } from '@src/webview/UsageSummary';

const day: UsageBreakdown = dayOfWork.windows.day;
const twoClis: UsageBreakdown = bothClis.windows.day;

// The headline and the controls that qualify it, including the `...`. The menu lives here rather
// than by the cost note because it changes these figures — and because down there it only rendered
// in Cost mode, which left the rest of the usage settings unreachable from Tokens.
const meta: Meta<typeof UsageSummary> = {
  title: 'Usage/UsageSummary',
  component: UsageSummary,
  args: {
    breakdown: day,
    metric: 'output-tokens',
    scope: 'all',
    onMetric: () => undefined,
    onScope: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageSummary>;

export const Tokens: Story = {};

// One figure per CLI in its own unit, with the `...` still pinned to the corner beside them.
export const Cost: Story = { args: { breakdown: twoClis, metric: 'cost' } };

// The case the corner has to survive: two figures and their captions wrap onto a second line, and
// the menu stays in the corner rather than dropping onto a line of its own under them.
export const NarrowPanel: Story = {
  args: { breakdown: twoClis, metric: 'cost' },
  globals: { viewport: { value: 'narrowPanel' } }
};
