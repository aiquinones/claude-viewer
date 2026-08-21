import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryTabs } from './MemoryTabs';

const meta: Meta<typeof MemoryTabs> = {
  title: 'Memory/MemoryTabs',
  component: MemoryTabs,
  args: { onChange: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[620px] border-b border-border px-3">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MemoryTabs>;

export const Claude: Story = {
  args: { tool: 'claude' }
};

// The other half of the surface: Copilot keeps its memories on GitHub, so its tab explains rather
// than lists.
export const Copilot: Story = {
  args: { tool: 'copilot' }
};
