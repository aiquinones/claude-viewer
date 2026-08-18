import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { StepDetail } from './StepDetail';

const shipIt = stepFlow.steps[3];
const ifItFails = shipIt.children[0];

// The right-hand pane variants A and B slide in. A sub-section is the same shape as a step, so
// this component renders both — drilling in just appends to the trail.
const meta: Meta<typeof StepDetail> = {
  title: 'Skills/Flow/StepDetail',
  component: StepDetail,
  args: { trail: [shipIt], stepIndex: 3 },
  decorators: [
    (Story) => (
      <div
        className="h-[30rem] w-[26rem] rounded-lg border border-border"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof StepDetail>;

// A step with prose, a skill chip and two sub-sections to go into.
export const Default: Story = {};

// One level down. The trail's first crumb is the way back up.
export const DrilledIn: Story = { args: { trail: [shipIt, ifItFails] } };

// Three levels, which is as deep as any real SKILL.md goes. The crumbs wrap rather than scroll.
export const DeepTrail: Story = {
  args: { trail: [shipIt, ifItFails, ifItFails.children[0]] }
};

// A step whose whole content is prose — no sub-sections, so the pane ends at the text.
export const NoSubSections: Story = { args: { trail: [stepFlow.steps[4]], stepIndex: 4 } };

// Tables, code fences and lists all reach this pane through the same `Blocks` the text view uses.
export const RichContent: Story = { args: { trail: [stepFlow.steps[2]], stepIndex: 2 } };
