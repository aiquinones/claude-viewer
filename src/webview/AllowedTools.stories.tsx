import type { Meta, StoryObj } from '@storybook/react-vite';
import { AllowedTools } from './AllowedTools';
import { projectDeploy } from './fixtures';

const meta: Meta<typeof AllowedTools> = {
  title: 'Skills/AllowedTools',
  component: AllowedTools,
  decorators: [(Story) => <div className="max-w-3xl py-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof AllowedTools>;

// A real override, including a pattern long enough to wrap.
export const Restricted: Story = {
  args: { tools: projectDeploy.allowedTools }
};

export const OneTool: Story = {
  args: { tools: ['Read'] }
};

// The common case — no override, so the section isn't there at all.
export const Unrestricted: Story = {
  args: { tools: [] }
};
