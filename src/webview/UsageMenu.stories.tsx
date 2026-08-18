import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, SettingSource, ViewerSettings } from '../model/settings/settings';
import { UsageCostBasis } from '../model/usage/types';
import { SettingsProvider } from './settings/SettingsContext';
import { UsageMenu } from './UsageMenu';

interface WithBasisArgs {
  basis: UsageCostBasis;
  source: SettingSource;
  children: ReactNode;
}

// The menu reads the setting rather than props, so a story sets it the way the host does.
const WithBasis = ({ basis, source, children }: WithBasisArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    usage: { ...DEFAULT_SETTINGS.usage, costBasis: { value: basis, source } }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

// Click to open — a hover menu closes under the pointer on the way to an item. It opens upward,
// since on the surface it sits at the bottom of the page.
const meta: Meta<typeof UsageMenu> = {
  title: 'Usage/UsageMenu',
  component: UsageMenu,
  decorators: [
    (Story) => (
      <div className="p-6 pt-72">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageMenu>;

// The default: every billed token, which is what the API charges.
export const Default: Story = {
  render: () => (
    <WithBasis basis="all" source="default">
      <UsageMenu />
    </WithBasis>
  )
};

// Output only, and the menu says the value is yours rather than the shipped one — same provenance
// line the budgets card prints, for the same reason.
export const OutputOnly: Story = {
  render: () => (
    <WithBasis basis="output" source="user">
      <UsageMenu />
    </WithBasis>
  )
};
