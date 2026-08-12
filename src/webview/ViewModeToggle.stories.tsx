import type { Meta, StoryObj } from '@storybook/react-vite';
import { ViewModeToggle } from './ViewModeToggle';

const meta: Meta<typeof ViewModeToggle> = {
  title: 'Skills/ViewModeToggle',
  component: ViewModeToggle,
  args: { mode: 'text', blockers: {} },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-8">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ViewModeToggle>;

// Flow is dimmed in every story — it isn't built, and the toggle says so rather than hiding it.
export const Text: Story = {};

export const Graph: Story = { args: { mode: 'graph' } };

// A skill nothing references: the reason replaces the label in the tooltip.
export const GraphBlocked: Story = {
  args: { blockers: { graph: 'This skill names no other, and none names it' } }
};

export const GraphLoading: Story = { args: { blockers: { graph: 'Building the graph…' } } };
