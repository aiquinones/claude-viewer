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

export const Default: Story = {};

// The slower tick, for deciding between the two by looking at them.
export const SlowTick: Story = { args: { tickMs: 2000 } };

export const Small: Story = { args: { className: 'size-6' } };

export const Large: Story = { args: { className: 'size-24' } };
