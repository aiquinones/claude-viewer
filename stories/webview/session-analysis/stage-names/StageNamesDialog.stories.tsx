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

// Nothing named, which is how it opens the first time. Every field draws its placeholder, so the
// list reads as "here is what ran, pick the stages" before it reads as a form. The row buttons all
// offer the skill's own name, since that's the fastest way out of this state.
export const Nothing: Story = {};

// Two of the four named. The buttons split with them — an X on a named row, the fill on a blank one
// — which is what makes both directions one control rather than a checkbox and a field.
export const SomeNamed: Story = {
  args: { current: { 'dev-feature': 'Build', 'create-pr': 'Ship' } }
};

// A stored name for a skill this session never ran. It isn't listed — the dialog speaks only for
// the skills in front of you — and Save carries it through untouched.
export const NameFromAnotherSession: Story = {
  args: { current: { 'dev-feature': 'Build', 'some-other-skill': 'Elsewhere' } }
};

// Enough skills that the list scrolls. The dialog stops growing rather than putting Save off the
// bottom of the panel.
export const ManySkills: Story = {
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

// Reached from a session that loaded no skills. The (i) is drawn beside that state's message too,
// so this is a state you can actually get to.
export const NoSkills: Story = { args: { skills: [] } };
