import type { Meta, StoryObj } from '@storybook/react-vite';
import { AGENT_ACTIVITIES } from '../model/types';
import { ActivityBadge } from './ActivityBadge';

const meta: Meta<typeof ActivityBadge> = {
  title: 'Agents/ActivityBadge',
  component: ActivityBadge
};

export default meta;

type Story = StoryObj<typeof ActivityBadge>;

export const Running: Story = { args: { activity: 'running', tail: 'working' } };

export const Blocked: Story = { args: { activity: 'blocked', tail: 'working' } };

export const Idle: Story = { args: { activity: 'idle', tail: 'settled' } };

// The same badge as Blocked. What differs is the tooltip: this one was read off an unanswered
// permission request rather than inferred from a stopped clock.
export const BlockedStated: Story = { args: { activity: 'blocked', tail: 'blocked' } };

// All three together, which is the only way to see that they read as one scale.
export const EveryState: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {AGENT_ACTIVITIES.map((activity) => (
        <ActivityBadge key={activity} activity={activity} tail="working" />
      ))}
    </div>
  )
};
