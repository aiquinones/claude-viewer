import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, ReactNode } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { TokenEstimator } from '@src/model/estimate-tokens';
import { DEFAULT_SETTINGS, ViewerSettings } from '@src/model/settings/settings';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { SessionAnalysisView } from '@src/webview/session-analysis/SessionAnalysisView';
import {
  bareDetail,
  claudeDetail,
  claudeSession,
  codexDetail,
  codexSession,
  copilotDetail,
  copilotSession,
  liveClaudeAgent,
  liveCopilotAgent,
  missingDetail,
  unpricedModelDetail
} from '../../session-detail-fixtures';
import { usageSkills } from '../../usage-fixtures';

// The estimator is a setting, so a story that wants one says so the way the host does — through the
// provider.
interface WithSettingsArgs {
  estimator?: TokenEstimator;
  children: ReactNode;
}

const WithSettings = ({ estimator, children }: WithSettingsArgs) => {
  const settings: ViewerSettings = {
    ...DEFAULT_SETTINGS,
    tokens: {
      estimator: { value: estimator ?? 'standard', source: estimator ? 'user' : 'default' }
    }
  };

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
};

const meta: Meta<typeof SessionAnalysisView> = {
  title: 'Usage/SessionAnalysisView',
  component: SessionAnalysisView,
  args: {
    session: claudeSession,
    workspaceRoot: claudeSession.cwd,
    detail: claudeDetail,
    onWatch: () => undefined,
    skills: usageSkills,
    onOpenSkill: () => undefined,
    onOpenAgents: () => undefined,
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

// One `/dev-feature` that loaded the body twice, five seconds apart — Copilot injects the skill
// because its name was typed and then loads it again when the model asks for what it already has.
// That is why the row counts loads rather than calls, and why the weighted sum is double the body.
//
// It bills in AIU, so the headline is that unit and the (i) beside it has no dollars to take apart.
export const CopilotDoubleLoad: Story = {
  args: { session: copilotSession, detail: copilotDetail }
};

// A Codex session. Its cost curve and its context curve both read exactly like Claude's — the
// dollars come off OpenAI's rate card rather than Anthropic's, which is a second table and not a
// second kind of number. Where it still differs is the skill list, which says Codex records no skill
// load rather than that none ran.
export const Codex: Story = {
  args: { session: codexSession, detail: codexDetail }
};

// The same session on a model newer than the rate table. The headline is a dash and the cost chart
// names the model instead of drawing a $0 curve along the floor, while everything measured in tokens
// — the context curve especially — is unaffected.
export const UnpricedModel: Story = {
  args: { session: codexSession, detail: unpricedModelDetail }
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

// The session is still running, so the host re-reads it every couple of seconds and the badge beside
// the name says why the numbers move. The same badge the Active Agents rows draw, on the same clock.
export const LiveClaude: Story = { args: { agent: liveClaudeAgent } };

// Waiting rather than Working, and it's a read state rather than an inferred one — Copilot writes an
// unanswered permission request to its log, so nothing here consults the clock.
export const LiveCopilot: Story = {
  args: { session: copilotSession, detail: copilotDetail, agent: liveCopilotAgent }
};

// Opened from an agent row's menu rather than from the list. The arrow retraces that — its tooltip
// reads "Back to Active Agents" — while the crumb beside it still says Usage, which is where this
// page lives however you reached it. The badge is the other half of the same trip: a session you
// reached from a running row is a session that is still running.
export const FromAnAgentRow: Story = {
  args: { agent: liveClaudeAgent, origin: { label: 'Active Agents', onReturn: () => undefined } }
};
