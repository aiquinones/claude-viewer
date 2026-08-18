import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { stepFlow } from '../fixtures';
import { surfaceAccent } from '../surfaces';
import { StepCard } from './StepCard';

// One step, in every state the three variants put it in. Hover a card to see the summary — how
// many sub-sections are under it and which skills it names.
const meta: Meta<typeof StepCard> = {
  title: 'Skills/Flow/StepCard',
  component: StepCard,
  args: { node: stepFlow.steps[3], index: 3, state: 'plain', compact: false },
  decorators: [
    (Story) => (
      // Room to the right of the card, since the summary pops out that side.
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

// The step the detail pane is showing.
export const Active: Story = { args: { state: 'active' } };

// Every other card while one is open — dimmed rather than dropped, so the sequence keeps its shape.
export const Faded: Story = { args: { state: 'faded' } };

// The rail the column shrinks to once a step opens. The badge is what stays readable.
export const Compact: Story = { args: { compact: true, state: 'active' } };

// A step that names skills but holds no sub-sections.
export const SkillsOnly: Story = { args: { node: stepFlow.steps[4], index: 4 } };

// A leaf: nothing under it and nothing named in it, so it gets no counts and no hover summary at
// all rather than an empty popup.
export const Bare: Story = { args: { node: stepFlow.steps[0].children[0], index: 0 } };
