import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageBreakdown } from '@src/model/usage/types';
import { bothClis, dayOfWork, threeClis, unpricedCodex } from '../usage-fixtures';
import { UsageSummary } from '@src/webview/UsageSummary';

const day: UsageBreakdown = dayOfWork.windows.day;
const twoClis: UsageBreakdown = bothClis.windows.day;
const allClis: UsageBreakdown = threeClis.windows.day;
const noRates: UsageBreakdown = unpricedCodex.windows.day;

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

// Three CLIs, three figures. Claude's and Codex's are both dollars estimated from tokens and are
// still drawn apart — two rate cards, and adding them would hide which one a number came from.
export const ThreeClis: Story = { args: { breakdown: allClis } };

// A CLI that ran on a model the rate table doesn't know. A dash rather than `$0`, which beside a
// real figure would read as a claim that it was free — its tokens are in the window, its dollars
// aren't, and the hover names the model.
export const UnpricedCli: Story = { args: { breakdown: noRates } };

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
