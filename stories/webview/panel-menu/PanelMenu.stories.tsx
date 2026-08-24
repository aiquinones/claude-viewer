import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, SettingSource, ViewerSettings } from '@src/model/settings/settings';
import { PanelTheme } from '@src/model/settings/theme';
import { PanelMenu } from '@src/webview/panel-menu/PanelMenu';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';

interface WithThemeArgs {
  mode?: PanelTheme;
  source?: SettingSource;
  children: ReactNode;
}

// The menu reads settings rather than props, so a story sets them the way the host does.
const WithTheme = ({ mode, source = 'user', children }: WithThemeArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    theme: { mode: mode ? { value: mode, source } : DEFAULT_SETTINGS.theme.mode }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

// The `...` at the end of every view's header — what changes how the panel looks, rather than what
// any one surface shows. One group so far, and two of its three modes have no palette behind them
// yet: they dim, and picking one asks the host to say it's coming rather than writing the setting.
const meta: Meta<typeof PanelMenu> = {
  title: 'Chrome/PanelMenu',
  component: PanelMenu,
  decorators: [
    (Story) => (
      <div className="flex h-[24rem] justify-end p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PanelMenu>;

// Nothing configured: the check sits on Inherit and the line says it's the default.
export const Default: Story = {
  render: () => (
    <WithTheme source="default">
      <PanelMenu />
    </WithTheme>
  )
};

// The same value, written to the user's settings.json rather than shipped. The only thing that
// moves is the provenance line — which is the point of printing it.
export const SetByUser: Story = {
  render: () => (
    <WithTheme mode="inherit">
      <PanelMenu />
    </WithTheme>
  )
};

// Set for the workspace, the layer a `.vscode/settings.json` writes.
export const SetForWorkspace: Story = {
  render: () => (
    <WithTheme mode="inherit" source="workspace">
      <PanelMenu />
    </WithTheme>
  )
};
