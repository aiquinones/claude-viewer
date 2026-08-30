import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageBreakdown } from '@src/model/usage/types';
import { bothClis, dayOfWork, threeClis } from '../usage-fixtures';
import { UsageSummary } from '@src/webview/UsageSummary';

const day: UsageBreakdown = dayOfWork.windows.day;
const twoClis: UsageBreakdown = bothClis.windows.day;
const allClis: UsageBreakdown = threeClis.windows.day;

// The surface's header: the cost, the (i) that takes it apart, the `...` holding which sessions are
// counted, and the window the figure is a total of. It sits above the tabs, so both tabs are read
// against the same number.
const meta: Meta<typeof UsageSummary> = {
  title: 'Usage/UsageSummary',
  component: UsageSummary,
  args: {
    breakdown: day,
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

// One CLI, so one figure. The (i) beside the caption is where the dollars come apart.
export const OneCli: Story = {};

// Both CLIs: one figure each, in its own unit, with the `...` still pinned to the corner beside
// them. There is no combined number — dollars and AIU don't add.
export const BothClis: Story = { args: { breakdown: twoClis } };

// Three CLIs, and the third has no unit at all. A dash rather than `0 AIU`: Codex bills against a
// rate-limit window, so a zero beside two real figures would read as a claim that it was free. Its
// turns are still in the window — they just aren't money.
export const UnpricedCli: Story = { args: { breakdown: allClis } };

// A week rather than a day. Only the caption under the figure says so — the header above it doesn't
// name the window, so this row is the whole answer to "a total of what?".
export const Week: Story = { args: { breakdown: dayOfWork.windows.week, window: 'week' } };

// Before the scan lands. A dash rather than a zero: there's no reading yet, and a zero would be one.
export const Scanning: Story = { args: { breakdown: undefined } };

// The case the corner has to survive: two figures and their captions wrap onto a second line, and
// the menu stays in the corner rather than dropping onto a line of its own under them.
export const NarrowPanel: Story = {
  args: { breakdown: twoClis },
  globals: { viewport: { value: 'narrowPanel' } }
};
