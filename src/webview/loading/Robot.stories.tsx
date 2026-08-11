import type { Meta, StoryObj } from '@storybook/react-vite';
import { Robot } from './Robot';

const meta: Meta<typeof Robot> = {
  title: 'Loading/Robot',
  component: Robot,
  decorators: [
    (Story) => (
      <div className="flex justify-center p-8 text-muted-foreground">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Robot>;

// A gesture every second: blink, pause, glance, pause.
export const Default: Story = {};

// The slower tick, for deciding between the two by looking at them.
export const SlowTick: Story = { args: { tickMs: 2000 } };

// Where the alternation is easiest to see, and to check the gestures never overlap.
export const VerySlowTick: Story = { args: { tickMs: 3000, className: 'size-24' } };

export const Small: Story = { args: { className: 'size-6' } };

export const Large: Story = { args: { className: 'size-24' } };
