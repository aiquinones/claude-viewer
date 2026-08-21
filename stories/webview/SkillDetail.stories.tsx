import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillDetail } from '@src/webview/SkillDetail';
import {
  bothIssues,
  longDescription,
  noDescription,
  noSkillFile,
  plainSkill,
  pluginDeploy,
  projectDeploy,
  userDeploy
} from '../fixtures';

const meta: Meta<typeof SkillDetail> = {
  title: 'Skills/SkillDetail',
  component: SkillDetail,
  args: {
    winner: undefined,
    shadowed: [],
    onOpenFile: () => undefined,
    onSelectSkill: () => undefined
  },
  decorators: [(Story) => <div className="max-w-3xl p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof SkillDetail>;

export const Default: Story = { args: { skill: plainSkill } };

// The winner's side of a collision: a crown beside the name, and the losers behind its hover card.
export const WinsCollision: Story = {
  args: { skill: projectDeploy, shadowed: [userDeploy, pluginDeploy] }
};

// The loser's side.
export const Shadowed: Story = {
  args: { skill: userDeploy, winner: projectDeploy }
};

// A long description, which the detail pane never truncates.
export const LongDescription: Story = { args: { skill: longDescription } };

// The empty-description case, which is the bug the panel exists to make visible.
export const NoDescription: Story = { args: { skill: noDescription } };

export const Unreadable: Story = { args: { skill: noSkillFile } };

export const MultipleIssues: Story = { args: { skill: bothIssues } };
