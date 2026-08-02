import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShadowNotice } from './ShadowNotice';
import { pluginDeploy, projectDeploy, userDeploy } from './fixtures';

const meta: Meta<typeof ShadowNotice> = {
  title: 'Skills/ShadowNotice',
  component: ShadowNotice,
  args: { onSelectSkill: () => undefined },
  decorators: [(Story) => <div className="max-w-2xl p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof ShadowNotice>;

// Standing on the losing skill.
export const Shadowed: Story = {
  args: { winner: projectDeploy, shadowed: [] }
};

// Standing on the winner, one loser.
export const WinsOverOne: Story = {
  args: { winner: undefined, shadowed: [userDeploy] }
};

// Standing on the winner, several losers — checks the plural.
export const WinsOverSeveral: Story = {
  args: { winner: undefined, shadowed: [userDeploy, pluginDeploy] }
};

// No collision at all: renders nothing.
export const NoCollision: Story = {
  args: { winner: undefined, shadowed: [] }
};

// Unreachable in the real model — a shadowed skill never wins anything, so it never shadows others.
// Kept as a story because the component doesn't enforce that and shouldn't fall over if it changes.
export const BothDirections: Story = {
  args: { winner: projectDeploy, shadowed: [pluginDeploy] }
};
