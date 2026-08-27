import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, SettingSource, ViewerSettings } from '@src/model/settings/settings';
import { UsageScope } from '@src/model/usage/types';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { UsageMenu } from '@src/webview/usage-menu/UsageMenu';

interface WithUsageArgs {
  scope?: UsageScope;
  // Which layer set it. The menu prints the line under the group, and a story is showing that line
  // rather than the layering behind it.
  source?: SettingSource;
  children: ReactNode;
}

// The menu reads the settings rather than props, so a story sets them the way the host does.
const WithUsage = ({ scope, source = 'user', children }: WithUsageArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    usage: {
      ...DEFAULT_SETTINGS.usage,
      ...(scope ? { scope: { value: scope, source } } : {})
    }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

// The one setting the usage surface reads: which sessions the figures count. Click to open — a
// hover menu closes under the pointer on the way to an item. It opens down and to the left, since on
// the surface it sits at the top-right of the header. The decorator gives it that corner so the menu
// is drawn where the surface draws it.
const meta: Meta<typeof UsageMenu> = {
  title: 'Usage/UsageMenu',
  component: UsageMenu,
  decorators: [
    (Story) => (
      <div className="flex h-[32rem] justify-end p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageMenu>;

// The shipped value: every session on the machine, which is what usage limits are counted against.
export const Default: Story = {
  render: () => (
    <WithUsage source="default">
      <UsageMenu />
    </WithUsage>
  )
};

// Moved off the default, and the group says the value is yours rather than the shipped one — the
// same provenance line the budgets card prints, for the same reason.
export const Customized: Story = {
  render: () => (
    <WithUsage scope="workspace">
      <UsageMenu />
    </WithUsage>
  )
};

// Set for the workspace rather than by the user, which is the layer a `.vscode/settings.json` writes.
export const SetForWorkspace: Story = {
  render: () => (
    <WithUsage scope="workspace" source="workspace">
      <UsageMenu />
    </WithUsage>
  )
};

// Narrow panel: the menu caps its width and stays inside the edge it opens against.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } },
  render: () => (
    <WithUsage scope="workspace">
      <UsageMenu />
    </WithUsage>
  )
};
