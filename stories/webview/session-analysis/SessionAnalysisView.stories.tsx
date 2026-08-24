import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, ReactNode } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { TokenEstimator } from '@src/model/estimate-tokens';
import { DEFAULT_SETTINGS, ViewerSettings } from '@src/model/settings/settings';
import { UsageCostBasis, UsageMetric } from '@src/model/usage/types';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { SessionAnalysisView } from '@src/webview/session-analysis/SessionAnalysisView';
import {
  bareDetail,
  claudeDetail,
  claudeSession,
  copilotDetail,
  copilotSession,
  missingDetail
} from '../../session-detail-fixtures';
import { usageSkills } from '../../usage-fixtures';

// The metric, the cost basis and the estimator are settings, so a story that wants one of them says
// so the way the host does — through the provider.
interface WithSettingsArgs {
  metric?: UsageMetric;
  costBasis?: UsageCostBasis;
  estimator?: TokenEstimator;
  children: ReactNode;
}

const WithSettings = ({ metric, costBasis, estimator, children }: WithSettingsArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    tokens: {
      estimator: { value: estimator ?? 'standard', source: estimator ? 'user' : 'default' }
    },
    usage: {
      ...DEFAULT_SETTINGS.usage,
      metric: { value: metric ?? 'output-tokens', source: metric ? 'user' : 'default' },
      costBasis: { value: costBasis ?? 'all', source: costBasis ? 'user' : 'default' }
    }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

const meta: Meta<typeof SessionAnalysisView> = {
  title: 'Usage/SessionAnalysisView',
  component: SessionAnalysisView,
  args: {
    session: claudeSession,
    detail: claudeDetail,
    onRequestDetail: () => undefined,
    skills: usageSkills,
    onOpenSkill: () => undefined,
    onCopyId: () => undefined,
    onSearch: () => undefined,
    onRefresh: () => undefined,
    onBack: () => undefined
  },
  decorators: [
    // The panel renders this inside the usage surface's accent, which is what colours every bar on
    // the page — a story without it shows the no-accent fallback and nothing else.
    (Story) => (
      <div
        className="h-screen"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionAnalysisView>;

// A long Claude session under one wrapper skill. The ticks under the chart are where a skill was
// loaded, so the `create-pr` spike near the end lines up with the row for it below.
export const Claude: Story = {};

// Dollars rather than tokens. The `...` here offers the metric and the Claude cost basis and not the
// scope — you are looking at one session, and it is in whatever folder it is in.
export const Cost: Story = {
  render: (args) => (
    <WithSettings metric="cost">
      <SessionAnalysisView {...args} />
    </WithSettings>
  )
};

// One `/dev-feature` that loaded the body twice, five seconds apart — Copilot injects the skill
// because its name was typed and then loads it again when the model asks for what it already has.
// That is why the row counts loads rather than calls, and why the weighted sum is double the body.
//
// The `...` drops the cost basis too: this session bills in AIU, which nothing here prices.
export const CopilotDoubleLoad: Story = {
  args: { session: copilotSession, detail: copilotDetail }
};

// The setting says Standard and the session ran Claude's tokenizer, so every size on the page is
// under a estimator the session didn't use. Hovering one says so and offers the session's instead —
// which writes nothing, and goes back when you leave the page.
export const EstimatorOverridden: Story = {
  render: (args) => (
    <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
  )
};

// The other way round: the setting agrees with the session, so no size opens a card at all. A card
// that says "these two match" teaches you to stop opening cards.
export const EstimatorAgrees: Story = {
  render: (args) => (
    <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
  )
};

// Most short sessions look like this — a handful of turns and no skill anywhere. Both lists say so
// rather than rendering as empty boxes.
export const NoSkills: Story = { args: { detail: bareDetail } };

// The transcript is gone: swept by Claude Code's own retention, or the row was stale. One sentence
// rather than a page of zeroes, which would read as a session that cost nothing.
export const Unreadable: Story = { args: { detail: missingDetail } };

// Before the host answers. The read is one file, so this is on screen for a few milliseconds in
// practice — but a cold disk is exactly when it isn't.
export const Loading: Story = { args: { detail: undefined } };
