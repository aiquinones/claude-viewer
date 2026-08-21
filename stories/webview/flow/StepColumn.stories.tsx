import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { sectionFlow, stepFlow } from '../../fixtures';
import { surfaceAccent } from '@src/webview/surfaces';
import { StepColumn } from '@src/webview/flow/StepColumn';

// The sequence on its own, without either shell around it. Variants A and B both draw this — what
// differs is whether it sits in a scroll container or on a canvas.
const meta: Meta<typeof StepColumn> = {
  title: 'Skills/Flow/StepColumn',
  component: StepColumn,
  args: { steps: stepFlow.steps, focusedStepId: undefined, compact: false },
  decorators: [
    (Story) => (
      <div
        className="w-[30rem] p-6"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof StepColumn>;

export const Default: Story = {};

// One step open: it takes the accent, the two connectors touching it light up, and every other
// card dims without leaving a gap in the sequence.
export const Focused: Story = { args: { focusedStepId: stepFlow.steps[2].id } };

// What the column becomes once the split opens — 11rem of rail, badges and truncated labels.
export const Rail: Story = {
  args: { focusedStepId: stepFlow.steps[2].id, compact: true },
  decorators: [
    (Story) => (
      <div className="w-44 p-2">
        <Story />
      </div>
    )
  ]
};

export const UnnumberedSections: Story = { args: { steps: sectionFlow.steps } };
