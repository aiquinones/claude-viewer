import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '@src/model/settings/settings';
import { ThemeMode } from '@src/model/settings/theme';
import { PanelMenu } from '@src/webview/panel-menu/PanelMenu';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';

interface WithThemeArgs {
  mode: ThemeMode;
  children: ReactNode;
}

// The menu reads settings rather than props, so a story sets them the way the host does. No source
// here — the theme group doesn't print one, so which layer a story claims to be is invisible.
const WithTheme = ({ mode, children }: WithThemeArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    theme: { mode: { value: mode, source: 'user' } }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

// The `...` at the end of every view's header — what changes how the panel looks, rather than what
// any one surface shows. One group so far: four modes, every one of them settable, from inheriting
// every color off the editor to inheriting none of them.
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

// The default: the panel's own palette, following whether the editor is light or dark.
export const Default: Story = {
  render: () => (
    <WithTheme mode="auto">
      <PanelMenu />
    </WithTheme>
  )
};

// A palette picked outright, whatever the editor is set to.
export const PanelDark: Story = {
  render: () => (
    <WithTheme mode="dark">
      <PanelMenu />
    </WithTheme>
  )
};

// The row that isn't a palette, and the only one carrying a hint — every color off the editor,
// which is what the panel drew before it had palettes of its own.
export const InheritsEveryColor: Story = {
  render: () => (
    <WithTheme mode="inherit">
      <PanelMenu />
    </WithTheme>
  )
};
