import type { Meta, StoryObj } from '@storybook/react-vite';
import { longDescription, noSkillFile, projectDeploy, userDeploy } from './fixtures';
import { SkillCost } from './SkillCost';

const meta: Meta<typeof SkillCost> = {
  title: 'Skills/SkillCost',
  component: SkillCost,
  decorators: [
    (Story) => (
      <div className="w-[560px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillCost>;

export const Default: Story = {
  args: { skill: projectDeploy }
};

// A long description is the case worth seeing: it's paid on every request, unlike the body.
export const LongDescription: Story = {
  args: { skill: longDescription }
};

// Shadowed, so the listing line is struck through — this skill's description never reaches Claude.
export const Shadowed: Story = {
  args: { skill: userDeploy }
};

// Nothing was read. Both numbers are zero and neither line disappears.
export const Unreadable: Story = {
  args: { skill: noSkillFile }
};
