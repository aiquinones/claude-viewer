import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillDetail } from './SkillDetail';
import {
  bothIssues,
  longDescription,
  noDescription,
  noSkillFile,
  plainSkill,
  pluginDeploy,
  projectDeploy,
  userDeploy
} from './fixtures';

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

// The winner's side of a collision, with the skills it beats listed and linked.
export const WinsCollision: Story = {
  args: { skill: projectDeploy, shadowed: [userDeploy, pluginDeploy] }
};

// The loser's side.
export const Shadowed: Story = {
  args: { skill: userDeploy, winner: projectDeploy }
};

// No tools declared — the skill inherits the session rather than being restricted.
export const NoAllowedTools: Story = { args: { skill: longDescription } };

// The empty-description case, which is the bug the panel exists to make visible.
export const NoDescription: Story = { args: { skill: noDescription } };

export const Unreadable: Story = { args: { skill: noSkillFile } };

export const MultipleIssues: Story = { args: { skill: bothIssues } };
