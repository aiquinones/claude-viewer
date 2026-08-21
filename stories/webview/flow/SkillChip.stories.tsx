import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { longDescription, noDescription, plainSkill } from '../../fixtures';
import { surfaceAccent } from '@src/webview/surfaces';
import { SkillChip } from '@src/webview/flow/SkillChip';

// A skill named inside a section. Hover for its description, click to go and read it.
const meta: Meta<typeof SkillChip> = {
  title: 'Skills/Flow/SkillChip',
  component: SkillChip,
  args: { reference: { skill: plainSkill, count: 1 } },
  decorators: [
    (Story) => (
      // The description box hangs below and to the right, so the story leaves it room.
      <div
        className="h-56 w-[24rem] p-6"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillChip>;

export const Default: Story = {};

// Named more than once in the same section — the count rides on the chip.
export const Repeated: Story = { args: { reference: { skill: plainSkill, count: 4 } } };

// More description than the box holds. It wraps rather than clipping: this is the one place the
// whole description is readable without leaving the flow.
export const LongDescription: Story = {
  args: { reference: { skill: longDescription, count: 1 } }
};

// A skill with nothing to say for itself. The box says so rather than opening empty.
export const NoDescription: Story = { args: { reference: { skill: noDescription, count: 1 } } };
