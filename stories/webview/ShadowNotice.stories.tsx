import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShadowNotice } from '@src/webview/ShadowNotice';
import { projectDeploy } from '../fixtures';

const meta: Meta<typeof ShadowNotice> = {
  title: 'Skills/ShadowNotice',
  component: ShadowNotice,
  args: { onSelectSkill: () => undefined },
  decorators: [(Story) => <div className="max-w-2xl p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof ShadowNotice>;

// Standing on the losing skill. The winning side is WinnerCrown, not this.
export const Shadowed: Story = {
  args: { winner: projectDeploy }
};

// No collision: renders nothing.
export const NoCollision: Story = {
  args: { winner: undefined }
};
