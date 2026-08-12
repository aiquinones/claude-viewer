import type { Meta, StoryObj } from '@storybook/react-vite';
import { AGENT_ACTIVITIES } from '../model/types';
import { ActivityBadge } from './ActivityBadge';

const meta: Meta<typeof ActivityBadge> = {
  title: 'Agents/ActivityBadge',
  component: ActivityBadge
};

export default meta;

type Story = StoryObj<typeof ActivityBadge>;

export const Running: Story = { args: { activity: 'running' } };

export const Blocked: Story = { args: { activity: 'blocked' } };

export const Idle: Story = { args: { activity: 'idle' } };

// All three together, which is the only way to see that they read as one scale.
export const EveryState: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {AGENT_ACTIVITIES.map((activity) => (
        <ActivityBadge key={activity} activity={activity} />
      ))}
    </div>
  )
};
