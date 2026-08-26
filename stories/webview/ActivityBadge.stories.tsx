import type { Meta, StoryObj } from '@storybook/react-vite';
import { AGENT_ACTIVITIES } from '@src/model/types';
import { ActivityBadge } from '@src/webview/ActivityBadge';

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

// The badge on a session page, where it's a way to the Active Agents list rather than a label. The
// same dot and word: what changes is that it takes a hover and a press, and the tooltip says where
// it goes.
export const Selectable: Story = {
  args: { activity: 'running', tail: 'working', onSelect: () => undefined }
};

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
