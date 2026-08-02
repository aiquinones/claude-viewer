import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillRow } from './SkillRow';
import { bothIssues, longDescription, noDescription, noSkillFile, plainSkill, userDeploy } from './fixtures';

const meta: Meta<typeof SkillRow> = {
  title: 'Skills/SkillRow',
  component: SkillRow,
  args: { selected: false, onSelect: () => undefined },
  decorators: [(Story) => <div className="w-72 p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof SkillRow>;

export const Default: Story = { args: { skill: plainSkill } };

export const Selected: Story = { args: { skill: plainSkill, selected: true } };

// Dimmed with an eye-off icon; Claude runs a different skill by this name.
export const Shadowed: Story = { args: { skill: userDeploy } };

// Selection wins over dimming, so a shadowed row you're reading is still legible.
export const ShadowedAndSelected: Story = { args: { skill: userDeploy, selected: true } };

// With no description the row falls back to the issue text.
export const WithWarning: Story = { args: { skill: noDescription } };

export const WithError: Story = { args: { skill: noSkillFile } };

// An error and a warning together — the dot takes the worse of the two.
export const WithBothIssues: Story = { args: { skill: bothIssues } };

// Long name and long description both have to truncate rather than widen the list.
export const Overflowing: Story = { args: { skill: longDescription } };
