import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { sectionFlow, stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { FlowCanvas } from './FlowCanvas';

// Variant B of three — the graph's vibe. Drag the background to pan, ⌘/ctrl + scroll to zoom,
// the corner button resets. Clicking a card still opens it beside the canvas.
//
// A press that lands on a card doesn't pan, or dragging from one would move the view and open the
// card on release.
const meta: Meta<typeof FlowCanvas> = {
  title: 'Skills/Flow/B · Canvas',
  component: FlowCanvas,
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

type Story = StoryObj<typeof FlowCanvas>;

export const Default: Story = {};

// The unnumbered fallback, on a canvas that can be panned away from it.
export const UnnumberedSections: Story = { args: { flow: sectionFlow } };

// Where this variant costs the most: the canvas keeps its full chrome in a rail 11rem wide.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
