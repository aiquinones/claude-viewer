import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AgentColor } from '../../model/types';
import { AgentColorPicker } from './AgentColorPicker';

// The swatch and the six behind it. On a row it's invisible until you hover — here it's on its own,
// so it shows.
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
