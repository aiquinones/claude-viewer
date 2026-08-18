import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { sectionFlow, stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { FlowColumn } from './FlowColumn';

// Variant A of three. Click a step: the stack shrinks to a rail and the step opens beside it.
// Inside the step, a sub-section row drills one level further and the trail is the way back.
//
// The accent is set by SkillView in the panel, so a story has to set it itself.
const meta: Meta<typeof FlowColumn> = {
  title: 'Skills/Flow/A · Column',
  component: FlowColumn,
  args: { flow: stepFlow },
  decorators: [
    (Story) => (
      <div
        className="h-[36rem] rounded-lg border border-border"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof FlowColumn>;

export const Default: Story = {};

// A SKILL.md with no numbering at all — the steps are the sections one level under its `#` title,
// and one of them is long enough to have to truncate.
export const UnnumberedSections: Story = { args: { flow: sectionFlow } };

// The panel in a split editor group. The rail and the detail pane have to share ~30rem.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
