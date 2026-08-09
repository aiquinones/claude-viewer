import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  circularImport,
  importedAgents,
  missingImport,
  nestedPrompt,
  projectPrompt,
  userPrompt
} from './fixtures';
import { PromptFileRow } from './PromptFileRow';

const meta: Meta<typeof PromptFileRow> = {
  title: 'SystemPrompt/PromptFileRow',
  component: PromptFileRow,
  args: {
    // The largest file in the fixture stack, so the shares read the way they do in the panel.
    groupChars: projectPrompt.chars,
    workspaceRoot: '/Users/dev/repos/example-app',
    onOpenFile: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-[520px] py-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PromptFileRow>;

// Outside the workspace, so the directory folds to `~`.
export const UserFile: Story = {
  args: { file: { ...userPrompt, order: 1 } }
};

// The biggest file in the stack — a full-width bar is the "go look at this one" signal.
export const ProjectFile: Story = {
  args: { file: { ...projectPrompt, order: 2 } }
};

export const Imported: Story = {
  args: { file: { ...importedAgents, order: 3 } }
};

// Nested files carry the directory they load under, which is the whole reason they're separated.
export const Conditional: Story = {
  args: { file: { ...nestedPrompt, order: 6 } }
};

// An `@` line pointing at a file that isn't there. Zero chars, so the bar is empty by definition.
export const BrokenImport: Story = {
  args: { file: { ...missingImport, order: 4 } }
};

export const Circular: Story = {
  args: { file: { ...circularImport, order: 5 } }
};
