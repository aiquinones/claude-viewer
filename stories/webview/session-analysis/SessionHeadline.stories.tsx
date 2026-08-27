import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { summarizeTurns } from '@src/model/usage/aggregate';
import { SessionDetail, UsageSummaryData } from '@src/model/usage/types';
import { surfaceAccent } from '@src/webview/surfaces';
import { SessionHeadline } from '@src/webview/session-analysis/SessionHeadline';
import { claudeDetail, codexDetail, copilotDetail } from '../../session-detail-fixtures';

// The session page's own total, and the `...` beside it. Its own component because what it prints
// depends on the CLI as well as the metric: three CLIs, three cost units, and one of them has none.

const summaryOf = (detail: SessionDetail): UsageSummaryData =>
  summarizeTurns({ turns: detail.turns });

const meta: Meta<typeof SessionHeadline> = {
  title: 'Usage/SessionHeadline',
  component: SessionHeadline,
  args: {
    detail: claudeDetail,
    summary: summaryOf(claudeDetail),
    metric: 'output-tokens'
  },
  decorators: [
    (Story) => (
      <div
        className="w-[36rem] max-w-full p-4"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionHeadline>;

export const Tokens: Story = {};

// Dollars, which is Claude's unit and the only one this repo has a rate table for.
export const ClaudeCost: Story = { args: { metric: 'cost' } };

// AIU, which Copilot writes itself. A different unit rather than a converted one — nothing in either
// CLI's data defines a rate between them.
export const CopilotCost: Story = {
  args: { detail: copilotDetail, summary: summaryOf(copilotDetail), metric: 'cost' }
};

// The case the component exists for. Codex bills against a rate-limit window, so there is no
// per-session figure at all — a dash, with the reason in the hover, rather than a `$0` or a `0 AIU`
// that would read as a session that cost nothing.
export const CodexHasNoCost: Story = {
  args: { detail: codexDetail, summary: summaryOf(codexDetail), metric: 'cost' }
};

// The same Codex session under the token metric, where it does have a figure — which is what makes
// the dash above about money rather than about an empty session.
export const CodexTokens: Story = {
  args: { detail: codexDetail, summary: summaryOf(codexDetail) }
};
