import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { sectionFlow, stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { FlowCanvas } from './FlowCanvas';

// The flow view. Move the pointer around the canvas and the light follows it on a spring; click a
// step and the column shrinks to a rail with the step open beside it; ↑ and ↓ then walk the
// sequence and Escape closes it. ⌘/ctrl + scroll zooms, and the reset button appears once you have.
//
// The accent is set by SkillView in the panel, so a story has to set it itself.
const meta: Meta<typeof FlowCanvas> = {
  title: 'Skills/Flow/Canvas',
  component: FlowCanvas,
  args: { flow: stepFlow },
  decorators: [
    (Story) => (
      // The canvas sizes itself, the way GraphView does — the decorator only sets the accent and
      // the padding it sits in.
      <div className="p-5" style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof FlowCanvas>;

export const Default: Story = {};

// A SKILL.md with no numbering at all — the steps are the sections one level under its `#` title,
// and one of them is long enough to have to truncate on the card.
export const UnnumberedSections: Story = { args: { flow: sectionFlow } };

// The panel in a split editor group: the 11rem rail and the detail pane have to share ~32rem.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};

// The panel maximised, which is where the canvas has room to be a canvas.
export const WidePanel: Story = {
  globals: { viewport: { value: 'widePanel' } }
};
