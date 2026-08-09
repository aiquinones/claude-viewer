import type { Meta, StoryObj } from '@storybook/react-vite';
import { circularImport, missingImport, projectPrompt, promptMarkdown } from './fixtures';
import { PromptBody } from './PromptBody';

const meta: Meta<typeof PromptBody> = {
  title: 'SystemPrompt/PromptBody',
  component: PromptBody,
  args: {
    file: projectPrompt,
    body: promptMarkdown,
    error: undefined,
    loading: false
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-[640px] overflow-y-auto">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PromptBody>;

export const Default: Story = {};

// Nothing selected. The pane is empty rather than prompting — the list above it is the view.
export const NoSelection: Story = {
  args: { file: undefined }
};

export const Loading: Story = {
  args: { body: undefined, loading: true }
};

export const ReadError: Story = {
  args: { body: '', error: 'EACCES: permission denied' }
};

// An `@` line pointing at a file that isn't there. The row carries the issue; the body says why
// there's nothing to show.
export const UnresolvedImport: Story = {
  args: { file: missingImport, body: '' }
};

// The entry that ends a cycle — the file is real, but nothing more is read from it here.
export const CircularImport: Story = {
  args: { file: circularImport, body: '' }
};

// A file that exists and is empty, which is different from one that was never read.
export const EmptyFile: Story = {
  args: { file: { ...projectPrompt, issues: [] }, body: '' }
};
