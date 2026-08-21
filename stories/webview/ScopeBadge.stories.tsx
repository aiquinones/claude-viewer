import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScopeBadge } from '@src/webview/ScopeBadge';

const meta: Meta<typeof ScopeBadge> = {
  title: 'Skills/ScopeBadge',
  component: ScopeBadge,
  decorators: [(Story) => <div className="p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof ScopeBadge>;

export const Project: Story = { args: { scope: 'project' } };

export const User: Story = { args: { scope: 'user' } };

export const Plugin: Story = { args: { scope: 'plugin' } };

// Plugin skills name their plugin instead of the scope — which plugin shipped it is the useful part.
export const PluginNamed: Story = { args: { scope: 'plugin', pluginName: 'hookify' } };
