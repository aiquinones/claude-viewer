import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageBreakdown } from '@src/model/usage/types';
import { bothClis, dayOfWork } from '../usage-fixtures';
import { UsageSummary } from '@src/webview/UsageSummary';

const day: UsageBreakdown = dayOfWork.windows.day;
const twoClis: UsageBreakdown = bothClis.windows.day;

// The surface's header: the figure, the `...` that holds every setting behind it, and the window the
// figure is a total of. It sits above the tabs, so both tabs are read against the same number.
const meta: Meta<typeof UsageSummary> = {
  title: 'Usage/UsageSummary',
  component: UsageSummary,
  args: {
    breakdown: day,
    metric: 'output-tokens',
    window: 'day',
    onWindow: () => undefined
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

// A week rather than a day. Only the caption under the figure says so — the header above it doesn't
// name the window, so this row is the whole answer to "a total of what?".
export const Week: Story = { args: { breakdown: dayOfWork.windows.week, window: 'week' } };

// Before the scan lands. A dash rather than a zero: there's no reading yet, and a zero would be one.
export const Scanning: Story = { args: { breakdown: undefined } };

// The case the corner has to survive: two figures and their captions wrap onto a second line, and
// the menu stays in the corner rather than dropping onto a line of its own under them.
export const NarrowPanel: Story = {
  args: { breakdown: twoClis, metric: 'cost' },
  globals: { viewport: { value: 'narrowPanel' } }
};
