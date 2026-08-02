import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillList } from './SkillList';
import { allSkills, plainSkill, projectDeploy } from './fixtures';

const meta: Meta<typeof SkillList> = {
  title: 'Skills/SkillList',
  component: SkillList,
  args: { onSelect: () => undefined },
  decorators: [(Story) => <div className="w-80 py-3"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof SkillList>;

// Every scope present. Headers are buttons — click one to collapse its group.
export const AllScopes: Story = {
  args: { skills: allSkills, selectedPath: projectDeploy.path }
};

// No folder open, so project scope is simply absent rather than empty.
export const NoProjectScope: Story = {
  args: {
    skills: allSkills.filter((skill) => skill.scope !== 'project'),
    selectedPath: plainSkill.path
  }
};

export const SingleScope: Story = {
  args: { skills: [plainSkill], selectedPath: plainSkill.path }
};

export const NothingSelected: Story = {
  args: { skills: allSkills, selectedPath: undefined }
};
