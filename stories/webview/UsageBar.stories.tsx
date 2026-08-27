import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageSlice } from '@src/model/usage/types';
import { plainSkill } from '../fixtures';
import { UsageBar } from '@src/webview/UsageBar';

const slice = (overrides: Partial<UsageSlice>): UsageSlice => ({
  skill: 'dev-feature',
  outputTokens: 109_631,
  usd: 11.99,
  nanoAiu: 0,
  turns: 214,
  sources: ['read'],
  fraction: 0.41,
  ...overrides
});

const meta: Meta<typeof UsageBar> = {
  title: 'Usage/UsageBar',
  component: UsageBar,
  args: {
    slice: slice({}),
    scale: 1,
    skill: { ...plainSkill, name: 'dev-feature' },
    onOpenSkill: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-96 rounded-lg border border-border">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageBar>;

// The name is a button: hovering says what the skill is for, clicking opens it on the skills
// surface. Same card the flow view's chips use.
export const Read: Story = {};

// A skill this workspace doesn't have. Usage spans every session on the machine, so most rows in a
// wide window name skills that live somewhere else — those are labels, with no card and no click.
export const NotInstalled: Story = { args: { skill: undefined } };

// Copilot's side. The skill is inferred there — it's announced once and never closed, so it claims
// every turn until the next one — and the tag is the only thing that says so.
export const Inferred: Story = {
  args: {
    slice: slice({ sources: ['inferred'], nanoAiu: 41_190_000_000, usd: 0 })
  }
};

// One skill run under both CLIs. Read on one side, inferred on the other, so the row is tagged and
// the tooltip says it's only partly.
export const Mixed: Story = {
  args: {
    slice: slice({ sources: ['read', 'inferred'], nanoAiu: 41_190_000_000 })
  }
};

// The turns that ran with no skill. Drawn muted rather than in the accent: it's the baseline the
// rest are measured against, not a participant.
export const NoSkill: Story = {
  args: {
    slice: slice({ skill: undefined, fraction: 0.55, usd: 16.4 })
  }
};

// Both units in one row, which happens when a skill ran under both CLIs. They're printed side by
// side and never added.
export const CostBothUnits: Story = {
  args: {
    slice: slice({
      sources: ['read', 'inferred'],
      usd: 11.99,
      nanoAiu: 41_190_000_000
    })
  }
};

// A long name against the numbers, which is what the wrapper's `min-w-0` is for — without it the
// name refuses to shrink and pushes the value and the share off the end of the row.
export const LongName: Story = {
  args: {
    slice: slice({ skill: 'writing-hookify-rules-for-a-monorepo' }),
    skill: { ...plainSkill, name: 'writing-hookify-rules-for-a-monorepo' }
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    )
  ]
};

// Under a percent, and not zero. `0%` beside a real number reads as a bug.
export const Sliver: Story = {
  args: {
    slice: slice({
      skill: 'track',
      fraction: 0.004,
      outputTokens: 890,
      usd: 0.004
    })
  }
};

// Bars are scaled to the biggest row rather than to 100%, so a window nothing dominates still has
// something to compare. This is that row at half the leader's share.
export const ScaledToLeader: Story = {
  args: { slice: slice({ fraction: 0.2 }), scale: 0.4 }
};
