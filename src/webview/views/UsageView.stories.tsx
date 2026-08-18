import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '../../model/settings/settings';
import { UsageMetric, UsageScope } from '../../model/usage/types';
import { SettingsProvider } from '../settings/SettingsContext';
import {
  bothClis,
  dayOfWork,
  noUsage,
  quietDay,
  unpricedModel,
  usageSkills
} from '../usage-fixtures';
import { UsageView } from './UsageView';

// The metric and the scope are settings, so a story that wants cost has to say so the way the host
// does — through the provider. Everything else on the surface is state or props.
interface WithSettingsArgs {
  metric?: UsageMetric;
  scope?: UsageScope;
  children: ReactNode;
}

const WithSettings = ({ metric, scope, children }: WithSettingsArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    usage: {
      metric: {
        value: metric ?? 'output-tokens',
        source: metric ? 'user' : 'default'
      },
      scope: { value: scope ?? 'all', source: scope ? 'user' : 'default' }
    }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

const meta: Meta<typeof UsageView> = {
  title: 'Usage/UsageView',
  component: UsageView,
  args: {
    report: dayOfWork,
    // Most rows have a skill behind them and are hoverable; `track` deliberately doesn't, which is
    // the ordinary case for a window covering every session on the machine.
    skills: usageSkills,
    onOpenSkill: () => undefined,
    onSearch: () => undefined,
    onRefresh: () => undefined,
    onBack: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageView>;

// A day under one wrapper skill. Note what the unattributed row does to the picture: it's most of
// the window, and hiding it would leave a breakdown whose percentages don't add up.
export const Day: Story = {};

export const Week: Story = { args: { initialWindow: 'week' } };

// Dollars on the Claude rows, AIU on the Copilot ones, and no combined figure anywhere — the two
// units have no conversion in either CLI's data.
export const Cost: Story = {
  args: { report: bothClis },
  render: (args) => (
    <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
  )
};

// The same window on tokens, which is the only metric with one total across both CLIs. Read it
// against Cost: the shares are the same, the numbers aren't comparable.
export const BothClis: Story = { args: { report: bothClis } };

// A model the price table doesn't know. Its tokens are in the total and its dollars aren't, and the
// note under the list names it rather than letting the figure look complete.
export const UnpricedModel: Story = {
  args: { report: unpricedModel },
  render: (args) => (
    <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
  )
};

// Nothing today. The Week toggle has something in it, which is what the empty copy points at.
export const QuietDay: Story = { args: { report: quietDay } };

// Nothing at all — a fresh machine, or a workspace scope that matches no session.
export const Empty: Story = { args: { report: noUsage } };

// Before the first scan lands. This surface reads every session log on the machine, so unlike the
// others it is not sent with the snapshot and the panel spends a moment here.
export const Scanning: Story = { args: { report: undefined } };
