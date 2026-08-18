import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { sectionFlow, stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { FlowOutline } from './FlowOutline';

// Variant C of three — no split and no canvas. A step unfolds where it stands, and its
// sub-sections unfold inside it, as deep as the file goes. Step 4 nests three levels.
const meta: Meta<typeof FlowOutline> = {
  title: 'Skills/Flow/C · Outline',
  component: FlowOutline,
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

type Story = StoryObj<typeof FlowOutline>;

export const Default: Story = {};

export const UnnumberedSections: Story = { args: { flow: sectionFlow } };

// The variant that survives a narrow panel best — nothing is ever side by side to begin with.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
