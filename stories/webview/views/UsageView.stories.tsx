import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '@src/model/settings/settings';
import { UsageCostBasis, UsageMetric, UsageScope } from '@src/model/usage/types';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import {
  bothClis,
  dayOfWork,
  noUsage,
  outputOnlyBasis,
  quietDay,
  unpricedModel,
  usageSkills
} from '../../usage-fixtures';
import {
  busyYear,
  copilotOnlyHistory,
  emptyHistory,
  quietHistory,
  resumedOldSession,
  shortRetention
} from '../../usage-history-fixtures';
import { UsageView } from '@src/webview/views/UsageView';

// The metric, the scope and the cost basis are settings, so a story that wants one of them has to say
// so the way the host does — through the provider. Everything else on the surface is state or props.
interface WithSettingsArgs {
  metric?: UsageMetric;
  scope?: UsageScope;
  costBasis?: UsageCostBasis;
  children: ReactNode;
}

const WithSettings = ({ metric, scope, costBasis, children }: WithSettingsArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    usage: {
      metric: {
        value: metric ?? 'output-tokens',
        source: metric ? 'user' : 'default'
      },
      scope: { value: scope ?? 'all', source: scope ? 'user' : 'default' },
      costBasis: { value: costBasis ?? 'all', source: costBasis ? 'user' : 'default' }
    }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

const meta: Meta<typeof UsageView> = {
  title: 'Usage/UsageView',
  component: UsageView,
  args: {
    report: dayOfWork,
    history: busyYear,
    workspaceRoot: '/Users/dev/repos/example-app',
    // What the panel opens on. The stories about the other tab name it themselves rather than
    // this default standing in for them — it was 'skills' here, which made the workbench claim the
    // surface opens somewhere it doesn't.
    initialTab: 'sessions',
    // Most rows have a skill behind them and are hoverable; `track` deliberately doesn't, which is
    // the ordinary case for a window covering every session on the machine.
    skills: usageSkills,
    onOpenSkill: () => undefined,
    sessionDetail: undefined,
    onRequestSessionDetail: () => undefined,
    onCopySessionId: () => undefined,
    onClearRequest: () => undefined,
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
export const Day: Story = { args: { initialTab: 'skills' } };

export const Week: Story = { args: { initialTab: 'skills', initialWindow: 'week' } };

// Dollars on the Claude rows, AIU on the Copilot ones, and no combined figure anywhere — the two
// units have no conversion in either CLI's data.
export const Cost: Story = {
  args: { initialTab: 'skills', report: bothClis },
  render: (args) => (
    <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
  )
};

// The same window on tokens, which is the only metric with one total across both CLIs. Read it
// against Cost: the shares are the same, the numbers aren't comparable.
export const BothClis: Story = { args: { initialTab: 'skills', report: bothClis } };

// Claude cost from output tokens alone, set through the `...` menu. Read it against Cost: the same
// turns, an order of magnitude apart, because the full figure is mostly context re-reads.
export const CostFromOutputOnly: Story = {
  args: { initialTab: 'skills', report: outputOnlyBasis },
  render: (args) => (
    <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
  )
};

// A model the price table doesn't know. Its tokens are in the total and its dollars aren't, and the
// note under the list names it rather than letting the figure look complete.
export const UnpricedModel: Story = {
  args: { initialTab: 'skills', report: unpricedModel },
  render: (args) => (
    <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
  )
};

// Nothing today. The Week toggle has something in it, which is what the empty copy points at.
export const QuietDay: Story = { args: { initialTab: 'skills', report: quietDay } };

// Nothing at all — a fresh machine, or a workspace scope that matches no session.
export const Empty: Story = { args: { initialTab: 'skills', report: noUsage } };

// Before the first scan lands. This surface reads every session log on the machine, so unlike the
// others it is not sent with the snapshot and the panel spends a moment here.
export const Scanning: Story = { args: { initialTab: 'skills', report: undefined } };

// The tab the surface opens on: a year of days, and every session on the machine under it.
export const Sessions: Story = {};

// A machine that's run a handful of sessions, all this week. Most of the grid is empty, which is
// what a rank-based scale still has to read as — the few days there are still get four shades.
export const SessionsQuiet: Story = {
  args: { history: quietHistory }
};

// The workspace scope with nothing under it. The toggle is the one the tab was missing, and the
// filtering behind it is the host's — `narrowHistory` runs on the way out of the store — so the tab
// draws whatever it was sent: a year of holes, and a list that says so.
export const SessionsEmpty: Story = {
  args: { history: emptyHistory },
  render: (args) => (
    <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
  )
};

// Before the history pass lands. It reads every transcript on the machine rather than the recent
// ones, so this tab waits on its own scan — the Skills tab beside it may already have its numbers.
export const SessionsScanning: Story = {
  args: { history: undefined }
};

// A machine that has only ever run Copilot. No `cleanupPeriodDays` on that side and no documented
// equivalent, so the window is whatever was found and the heading carries no (i) to explain it.
export const SessionsCopilot: Story = {
  args: { history: copilotOnlyHistory }
};

// `cleanupPeriodDays` set to a week. The grid shrinks to the window that can hold data, instead of
// drawing eleven empty months to reach it.
export const SessionsShortRetention: Story = {
  args: { history: shortRetention }
};

// One session resumed months after it ran, which is the only way history outlives the sweep. The
// grid widens to hold it and the card beside the heading says why.
export const SessionsResumedOldSession: Story = {
  args: { history: resumedOldSession }
};

// A session asked for by id from an agent row's menu, before the history pass it's resolved against
// has landed. The tabs are not drawn behind this on purpose: the reader asked for one page, and the
// grid arriving first would read as the wrong thing having opened.
export const AnalyzeResolving: Story = {
  args: {
    history: undefined,
    request: { sessionId: 'session-1', tool: 'claude', nonce: 1 }
  }
};

// The same request once the history holds it. From here it's the page a Sessions row opens — the
// resolution sets the same state, so nothing downstream knows which way it was reached.
export const AnalyzeOpens: Story = {
  args: { request: { sessionId: 'session-1', tool: 'claude', nonce: 1 } }
};

// A running agent that hasn't finished a turn has nothing folded for it, so the id resolves to
// nothing. Ordinary rather than an error, which is why the note lists the ways it happens.
export const AnalyzeNotFound: Story = {
  args: { request: { sessionId: 'session-not-on-disk', tool: 'claude', nonce: 1 } }
};

// The same miss with the scope set to this workspace, which is the one reason for it the reader can
// do something about — so it's the one the note names instead of the others.
export const AnalyzeNotFoundScoped: Story = {
  args: { request: { sessionId: 'session-not-on-disk', tool: 'copilot', nonce: 1 } },
  render: (args) => (
    <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
  )
};
