import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentColor } from '@src/model/types';
import { ColorSwatches } from '@src/webview/agent-color/ColorSwatches';

// The six row colours and the way back to none, as they sit at the foot of a row's command menu.
// No trigger of its own any more — the menu around it is what opens and dismisses.
const meta: Meta<typeof ColorSwatches> = {
  title: 'Agents/ColorSwatches',
  component: ColorSwatches,
  args: { color: undefined, onPick: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-md border border-border bg-popover p-1">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ColorSwatches>;

// Nothing picked. The ban button is selected, which is what "no colour" means here.
export const Unset: Story = {};

// The ring is what says which one is on — a swatch is its colour and nothing else, so selection
// can't be drawn inside it.
export const Picked: Story = { args: { color: 'purple' } };

// Live, so the ring moves and pressing the selected colour clears it — the behaviour that makes
// the ban button the discoverable way rather than the only one.
export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState<AgentColor | undefined>('green');
    return <ColorSwatches color={color} onPick={setColor} />;
  }
};
