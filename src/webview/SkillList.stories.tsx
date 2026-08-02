import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reveal } from '../model/types';
import { SkillList } from './SkillList';
import { allSkills, nameMismatch, plainSkill, projectDeploy } from './fixtures';

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

// Collapse the Plugin group, then reveal — the group has to reopen, or a deep link into it looks
// like it did nothing. Interactive because collapse state lives inside SkillList.
export const RevealIntoCollapsedGroup: Story = {
  render: () => {
    const [reveal, setReveal] = useState<Reveal | undefined>(undefined);

    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1 text-xs"
          onClick={() => setReveal((previous) => ({
            path: nameMismatch.path,
            nonce: (previous?.nonce ?? 0) + 1
          }))}
        >
          Reveal a plugin skill
        </button>
        <SkillList
          skills={allSkills}
          selectedPath={reveal?.path}
          reveal={reveal}
          onSelect={() => undefined}
        />
      </div>
    );
  }
};
