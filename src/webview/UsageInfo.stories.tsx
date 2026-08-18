import type { Meta, StoryObj } from '@storybook/react-vite';
import { bothClis, dayOfWork, noUsage, unpricedModel } from './usage-fixtures';
import { UsageInfo } from './UsageInfo';

// The card only opens on hover, and it opens *upward* — on the surface it sits at the bottom of the
// page. Hence the padding above it here.
const meta: Meta<typeof UsageInfo> = {
  title: 'Usage/UsageInfo',
  component: UsageInfo,
  args: { breakdown: dayOfWork.windows.day },
  decorators: [
    (Story) => (
      <div className="p-6 pt-64">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageInfo>;

// The composition is the point: cache reads lead, because every turn re-reads the context it's
// working in and nothing on the surface counts those tokens. That's what makes the total look wrong
// next to an output figure.
export const Default: Story = {};

// Both CLIs, so the model list spans them — Copilot runs Claude models too, and only Claude Code's
// rows carry dollars.
export const BothClis: Story = { args: { breakdown: bothClis.windows.day } };

// A model with no rates. It keeps its share of the tokens and says its dollars aren't counted.
export const UnpricedModel: Story = { args: { breakdown: unpricedModel.windows.day } };

// Nothing in the window. The (i) renders nothing at all rather than opening an empty box.
export const Empty: Story = { args: { breakdown: noUsage.windows.day } };
