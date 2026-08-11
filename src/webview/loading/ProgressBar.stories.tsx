import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Loading/ProgressBar',
  component: ProgressBar,
  args: { fraction: 0.4, indeterminate: false },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-8">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Empty: Story = { args: { fraction: 0 } };

export const PartlyFilled: Story = {};

// Where the crawl stops on its own. It never draws a full bar off a guess.
export const AtTheCeiling: Story = { args: { fraction: 0.9 } };

export const Full: Story = { args: { fraction: 1 } };

export const Sweeping: Story = { args: { indeterminate: true } };

// A view that sets --surface-accent gets a bar in its color.
export const OnASurfaceAccent: Story = {
  decorators: [
    (Story) => (
      <div
        className="flex justify-center p-8"
        style={{ '--surface-accent': '#c4785f' } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};
