import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceOption } from '@src/webview/menu/choice-option';
import { MenuChoice } from '@src/webview/menu/MenuChoice';

type Mode = 'inherit' | 'dark' | 'light';

const OPTIONS: readonly ChoiceOption<Mode>[] = [
  { id: 'inherit', label: 'Inherit from editor' },
  { id: 'dark', label: 'Dark', soon: true },
  { id: 'light', label: 'Light', soon: true }
];

// The other shape: a label that can't say it on its own, so the sentence rides under it.
const HINTED: readonly ChoiceOption<Mode>[] = OPTIONS.map((option) => ({
  ...option,
  hint: `What picking ${option.label.toLowerCase()} would mean, said in a sentence.`
}));

// One setting inside a `...`, as a group of radio rows. The check says which one is on — something a
// contributed VS Code menu can't draw — and the line at the top right says which layer set it.
const meta: Meta<typeof MenuChoice<Mode>> = {
  title: 'Chrome/MenuChoice',
  component: MenuChoice,
  args: { label: 'Theme', options: OPTIONS, value: 'inherit', onChoose: () => undefined },
  // The popover's own padding and background, so the rows are read against what holds them.
  decorators: [
    (Story) => (
      <div className="p-6">
        <div className="w-max max-w-96 rounded-md border border-border bg-popover p-1.5 text-xs">
          <Story />
        </div>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MenuChoice<Mode>>;

// The shipped value, and two options that exist but aren't built. A `soon` row dims and marks
// itself — dimming it is what says the mode is coming rather than missing.
export const Default: Story = {
  args: { source: 'default' }
};

// The same rows with hints under them, which is what the usage surface's groups look like — there
// the labels are two readings of one number and can't say which on their own.
export const WithHints: Story = {
  args: { source: 'user', options: HINTED }
};

// Set by the user rather than shipped. Same rows, different provenance line.
export const SetByUser: Story = {
  args: { source: 'user' }
};

// Set in a `.vscode/settings.json`, which is the layer that beats the user's.
export const SetForWorkspace: Story = {
  args: { source: 'workspace' }
};

// Every option available, which is what this group looks like once both palettes ship.
export const NothingSoon: Story = {
  args: {
    source: 'user',
    value: 'dark',
    options: OPTIONS.map((option) => ({ ...option, soon: false }))
  }
};
