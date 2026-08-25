import type { Meta, StoryObj } from '@storybook/react-vite';
import { StageNamesDialog } from '@src/webview/session-analysis/stage-names/StageNamesDialog';

const meta: Meta<typeof StageNamesDialog> = {
  title: 'Usage/StageNamesDialog',
  component: StageNamesDialog,
  args: {
    skills: ['dev-feature', 'claude-api', 'create-pr', 'publish'],
    current: {},
    onSave: () => undefined,
    onDismiss: () => undefined
  },
  // The dialog is `fixed`, so it needs a full-height frame to sit in rather than the docs canvas.
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof StageNamesDialog>;

// Nothing overridden, which is how it opens the first time. Every field draws its placeholder, so
// the list reads as "these are the stages" before it reads as a form.
export const NoOverrides: Story = {};

// Names already stored. This is the case worth having: an override you can't see is one you can't
// take back, and the fields are where it's shown.
export const WithOverrides: Story = {
  args: { current: { 'dev-feature': 'Build', 'create-pr': 'Ship' } }
};

// A stored name for a skill this session never ran. It isn't listed — the dialog speaks only for
// the stages in front of you — and Save carries it through untouched.
export const OverrideFromAnotherSession: Story = {
  args: { current: { 'dev-feature': 'Build', 'some-other-skill': 'Elsewhere' } }
};

// Enough stages that the list scrolls. The dialog stops growing rather than putting Save off the
// bottom of the panel.
export const ManyStages: Story = {
  args: {
    skills: [
      'dev-feature',
      'claude-api',
      'create-pr',
      'publish',
      'design',
      'review',
      'commit',
      'post-mortem',
      'update-docs',
      'perform-testing',
      'track',
      'follow-up'
    ]
  }
};

// Reached from a session that loaded no skills. The (i) is drawn beside the empty wheels too, so
// this is a state you can actually get to.
export const NoStages: Story = { args: { skills: [] } };
