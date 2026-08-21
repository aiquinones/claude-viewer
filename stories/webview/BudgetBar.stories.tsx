import type { Meta, StoryObj } from '@storybook/react-vite';
import { BudgetReading, readBudget } from '@src/model/settings/budget';
import { BudgetBar } from '@src/webview/BudgetBar';

const meta: Meta<typeof BudgetBar> = {
  title: 'Skills/BudgetBar',
  component: BudgetBar,
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof BudgetBar>;

// The real reading, so a change to where `near` starts shows up in these stories rather than being
// duplicated here. Every limit below is a positive literal, so it never comes back undefined.
const reading = (args: { value: number; limit: number }): BudgetReading =>
  readBudget(args) as BudgetReading;

export const Within: Story = {
  args: { reading: reading({ value: 42, limit: 100 }) }
};

// Just past 75% of the limit — the first value that isn't comfortable.
export const Near: Story = {
  args: { reading: reading({ value: 78, limit: 100 }) }
};

export const Over: Story = {
  args: { reading: reading({ value: 134, limit: 100 }) }
};

// Far over. The fill clamps, so this looks like Over rather than running past its track.
export const FarOver: Story = {
  args: { reading: reading({ value: 940, limit: 100 }) }
};

// Nothing measured yet — an empty track rather than a missing one.
export const Empty: Story = {
  args: { reading: reading({ value: 0, limit: 100 }) }
};
