import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  allPromptFiles,
  brokenPromptFiles,
  userOnlyPromptFiles,
  nestedPrompt
} from './fixtures';
import { PromptList } from './PromptList';

const meta: Meta<typeof PromptList> = {
  title: 'SystemPrompt/PromptList',
  component: PromptList,
  args: {
    workspaceRoot: '/Users/dev/repos/example-app',
    selectedOrder: undefined,
    onSelect: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-[560px] px-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PromptList>;

export const Default: Story = {
  args: { files: allPromptFiles }
};

// Both sections empty except one — a section with nothing in it renders nothing at all.
export const NoConditionalFiles: Story = {
  args: { files: userOnlyPromptFiles }
};

export const OnlyConditionalFiles: Story = {
  args: { files: [{ ...nestedPrompt, order: 1 }] }
};

export const WithBrokenImports: Story = {
  args: { files: brokenPromptFiles }
};

// A row stays lit while its body renders below — in the panel that body is the pane's second half.
export const WithSelection: Story = {
  args: { files: allPromptFiles, selectedOrder: 2 }
};
