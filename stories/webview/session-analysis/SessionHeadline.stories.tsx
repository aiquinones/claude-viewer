import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { summarizeTurns } from '@src/model/usage/aggregate';
import { SessionDetail, UsageSummaryData } from '@src/model/usage/types';
import { surfaceAccent } from '@src/webview/surfaces';
import { SessionHeadline } from '@src/webview/session-analysis/SessionHeadline';
import {
  claudeDetail,
  codexDetail,
  copilotDetail,
  unpricedModelDetail
} from '../../session-detail-fixtures';

// The session page's own total. Its own component because what it prints depends on more than the
// figure: two of the three CLIs are priced from a rate table, and a session can have run on a model
// that table has never heard of.

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

// Dollars, worked out from the tokens the transcript recorded. The (i) beside the caption is where
// that figure comes apart.
export const Claude: Story = {};

// AIU, which Copilot writes itself. A different unit rather than a converted one — nothing in either
// CLI's data defines a rate between them.
export const Copilot: Story = {
  args: { detail: copilotDetail, summary: summaryOf(copilotDetail) }
};

// Dollars again, off OpenAI's rate card rather than Anthropic's. Codex bills against a rate-limit
// window and pays none of this — but neither does Claude Code on a plan, and the (i) says so for
// both, so the two are the same kind of estimate.
export const Codex: Story = {
  args: { detail: codexDetail, summary: summaryOf(codexDetail) }
};

// The case this component exists for. Nothing in the session could be priced — a model newer than
// the rate table — so a dash with the reason in the hover, rather than a `$0` that would read as a
// session that cost nothing. The request count beside it is still real.
export const UnpricedModel: Story = {
  args: { detail: unpricedModelDetail, summary: summaryOf(unpricedModelDetail) }
};
