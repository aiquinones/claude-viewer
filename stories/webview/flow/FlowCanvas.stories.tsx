import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { longFlow, sectionFlow, stepFlow } from '../../fixtures';
import { surfaceAccent } from '@src/webview/surfaces';
import { FlowCanvas } from '@src/webview/flow/FlowCanvas';

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
      // A pane the height of the panel, scrolling. The canvas is as tall as its flow and scrolls
      // nothing itself, so a decorator that only padded it would hide the thing worth looking at.
      <div
        className="h-screen overflow-y-auto overflow-x-clip p-5"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
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

// Twelve steps: the box is taller than the pane, so the pane scrolls it, the hint and the reset
// button ride the bottom edge, and the light stays in the middle of what you're looking at.
export const LongFlow: Story = { args: { flow: longFlow } };

// A vscode:// link that named a step. The flow opens on it rather than showing whole — which is
// what a link into a sequence should do, since the column around it is what says where in the
// sequence you are.
export const LinkedStep: Story = {
  args: { target: { slug: '3-commit', nonce: 1 } }
};

// A link that named a heading *inside* a step. The trail is the step plus the sub-section, so the
// detail pane opens already drilled in and the crumb says which step it belongs to.
export const LinkedSubSection: Story = {
  args: { target: { slug: 'the-remote', nonce: 1 } }
};

// The panel in a split editor group: the 11rem rail and the detail pane have to share ~32rem.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};

// The panel maximised, which is where the canvas has room to be a canvas.
export const WidePanel: Story = {
  globals: { viewport: { value: 'widePanel' } }
};
