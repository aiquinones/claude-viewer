import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { SkillLoadList } from '@src/webview/session-analysis/SkillLoadList';
import { toSkillLoads } from '@src/webview/session-analysis/skill-loads';
import { claudeDetail, copilotDetail } from '../../session-detail-fixtures';
import { usageSkills } from '../../usage-fixtures';

const claudeLoads = toSkillLoads({
  invocations: claudeDetail.invocations,
  skills: usageSkills,
  estimator: 'anthropic'
});

const meta: Meta<typeof SkillLoadList> = {
  title: 'Usage/SkillLoadList',
  component: SkillLoadList,
  args: {
    loads: claudeLoads,
    estimator: 'anthropic',
    sessionEstimator: 'anthropic',
    reason: 'This is a Claude Code session, so it ran Claude’s tokenizer.',
    onUseSessionEstimator: () => undefined,
    onOpenSkill: () => undefined
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

type Story = StoryObj<typeof SkillLoadList>;

// Most loaded first, ties broken by size. The heading carries size × loads, which is what these
// skills cost the session in context.
export const Loaded: Story = {};

// The setting and the session disagree, so every size is under an estimator the session didn't use.
// The dotted underline is the tell; hovering one says which, and offers the session's.
export const Overridden: Story = {
  args: {
    loads: toSkillLoads({
      invocations: claudeDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard'
  }
};

// One skill loaded twice for one typed command. Two loads of a 3,592-char body is 7,184 chars of
// context, and the weighted sum is the only place that shows up.
export const CopilotDoubleLoad: Story = {
  args: {
    loads: toSkillLoads({
      invocations: copilotDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard',
    sessionEstimator: 'standard',
    reason: 'This Copilot session mostly ran gpt-5.6-luna, which is not a Claude model.'
  }
};

// A skill this machine doesn't have. Copilot recorded what it loaded, so the row still has a size —
// it's the only reason that row isn't a dash.
export const NotInstalled: Story = {
  args: {
    loads: toSkillLoads({
      invocations: [
        { skill: 'ship-it', at: Date.now(), via: 'event', chars: 2_400 },
        { skill: 'audit', at: Date.now(), via: 'tool' }
      ],
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard',
    sessionEstimator: 'standard'
  }
};

// Nothing ran. Says so rather than drawing an empty box under a heading claiming a total of zero.
export const None: Story = { args: { loads: [] } };
