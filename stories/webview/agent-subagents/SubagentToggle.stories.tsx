import type { Meta, StoryObj } from '@storybook/react-vite';
import { SubagentToggle } from '@src/webview/agent-subagents/SubagentToggle';

const meta: Meta<typeof SubagentToggle> = {
  title: 'Agents/SubagentToggle',
  component: SubagentToggle,
  args: { onToggle: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SubagentToggle>;

export const Collapsed: Story = { args: { count: 3, open: false } };

export const Expanded: Story = { args: { count: 3, open: true } };

// The plural is the whole reason this takes a count rather than reading a length at the call site.
export const One: Story = { args: { count: 1, open: false } };
