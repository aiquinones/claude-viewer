import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { StepCard } from './StepCard';

// One step, in every state the canvas puts it in. Two lines and a narrow box: the second line says
// what's inside, and hovering names the skills, which is the part that wouldn't fit.
const meta: Meta<typeof StepCard> = {
  title: 'Skills/Flow/StepCard',
  component: StepCard,
  args: { node: stepFlow.steps[3], index: 3, state: 'plain', compact: false },
  decorators: [
    (Story) => (
      // Room to the right of the card, since the mentions popup opens that side.
      <div
        className="w-[34rem] p-8"
        style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof StepCard>;

export const Default: Story = {};

// The step the detail pane is showing. The badge fills, which is what stays readable in the rail.
export const Active: Story = { args: { state: 'active' } };

// Every other card while one is open — dimmed rather than dropped, so the sequence keeps its shape.
export const Faded: Story = { args: { state: 'faded' } };

// The rail the column shrinks to once a step opens: one line, no summary, badge and what fits.
export const Compact: Story = {
  args: { compact: true, state: 'active' },
  decorators: [
    (Story) => (
      <div className="w-40 p-2">
        <Story />
      </div>
    )
  ]
};

// A step that names skills but holds no sub-sections — the summary line says only the half that's
// true.
export const SkillsOnly: Story = { args: { node: stepFlow.steps[4], index: 4 } };

// A leaf: nothing under it and nothing named in it. The summary line still renders, so the card is
// the same height as its neighbours, and there's no hover popup at all.
export const Bare: Story = { args: { node: stepFlow.steps[0].children[0], index: 0 } };
