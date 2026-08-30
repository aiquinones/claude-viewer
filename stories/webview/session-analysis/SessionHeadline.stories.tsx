import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { summarizeTurns } from '@src/model/usage/aggregate';
import { SessionDetail, UsageSummaryData } from '@src/model/usage/types';
import { surfaceAccent } from '@src/webview/surfaces';
import { SessionHeadline } from '@src/webview/session-analysis/SessionHeadline';
import { claudeDetail, codexDetail, copilotDetail } from '../../session-detail-fixtures';

// The session page's own total. Its own component because what it prints depends on the CLI: three
// of them, three answers, and one of those is that there is no answer.

const summaryOf = (detail: SessionDetail): UsageSummaryData =>
  summarizeTurns({ turns: detail.turns });

const meta: Meta<typeof SessionHeadline> = {
  title: 'Usage/SessionHeadline',
  component: SessionHeadline,
  args: {
    detail: claudeDetail,
    summary: summaryOf(claudeDetail)
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

// Dollars, which is Claude's unit and the only one this repo has a rate table for. The (i) beside
// the caption is where that figure comes apart.
export const Claude: Story = {};

// AIU, which Copilot writes itself. A different unit rather than a converted one — nothing in either
// CLI's data defines a rate between them.
export const Copilot: Story = {
  args: { detail: copilotDetail, summary: summaryOf(copilotDetail) }
};

// The case this component exists for. Codex bills against a rate-limit window, so there is no
// per-session figure at all — a dash, with the reason in the hover, rather than a `$0` or a `0 AIU`
// that would read as a session that cost nothing. The request count beside it is still real.
export const CodexHasNoCost: Story = {
  args: { detail: codexDetail, summary: summaryOf(codexDetail) }
};
