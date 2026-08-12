import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  WORKSPACE,
  circularImport,
  deepNestedPrompt,
  missingImport,
  projectPrompt,
  promptMarkdown,
  userPrompt
} from './fixtures';
import { PromptBody } from './PromptBody';

const meta: Meta<typeof PromptBody> = {
  title: 'SystemPrompt/PromptBody',
  component: PromptBody,
  args: {
    file: projectPrompt,
    body: promptMarkdown,
    error: undefined,
    loading: false,
    workspaceRoot: WORKSPACE
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

// At the workspace root there's no directory left to show, so the title is just the name.
export const Default: Story = {};

// Outside the workspace, where the directory folds to `~`. Scroll it: the path stays pinned and
// the file's own headings stack underneath it.
export const UserFile: Story = {
  args: { file: userPrompt }
};

// The path the pane can't fit. The directory truncates and the filename survives — the reverse
// would leave every row of this surface reading the same.
export const DeepPath: Story = {
  args: { file: deepNestedPrompt }
};

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
