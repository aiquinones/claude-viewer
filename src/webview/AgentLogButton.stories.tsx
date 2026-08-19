import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentLogButton } from './AgentLogButton';

// The button only exists while the pointer is over the row, so the decorator is a row — hover it
// and the icon appears in the corner where the real one sits.
const meta: Meta<typeof AgentLogButton> = {
  title: 'Agents/AgentLogButton',
  component: AgentLogButton,
  args: { onOpen: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-3">
        <div className="group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-accent">
          <span className="text-sm">Hover the row</span>
          <Story />
        </div>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentLogButton>;

// Invisible at rest, and still laid out: the row must not reflow as the pointer crosses it.
export const OnHover: Story = {};
