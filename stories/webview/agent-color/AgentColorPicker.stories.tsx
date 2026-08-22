import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AgentColor } from '@src/model/types';
import { AgentColorPicker } from '@src/webview/agent-color/AgentColorPicker';

// The swatch and the six behind it. It used to sit at the end of every agent row, invisible until
// you hovered; nothing mounts it now, so this file is the only place it's drawn — and the reason
// the component doesn't rot while there's no way into it.
const meta: Meta<typeof AgentColorPicker> = {
  title: 'Agents/AgentColorPicker',
  component: AgentColorPicker,
  args: { color: undefined, onPick: () => undefined },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-8 pr-16">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentColorPicker>;

// Nothing chosen: an outline with a dot in it, which is what a row shows on hover.
export const Unset: Story = {};

export const Purple: Story = { args: { color: 'purple' } };

// Picking one for real. The panel routes this to the host; the point here is that the swatch, the
// selected ring and the dismiss all behave.
export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState<AgentColor | undefined>('green');
    return <AgentColorPicker color={color} onPick={setColor} />;
  }
};
