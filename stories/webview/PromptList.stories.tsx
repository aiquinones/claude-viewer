import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  allPromptFiles,
  brokenPromptFiles,
  userOnlyPromptFiles,
  nestedPrompt
} from '../fixtures';
import { PromptList } from '@src/webview/PromptList';

// In the panel this belongs to the view, which scrolls back to whatever it lands on. Nothing here
// reads it — the stories only have to hand the list something to attach.
const selectionRef = createRef<HTMLDivElement>();

const meta: Meta<typeof PromptList> = {
  title: 'SystemPrompt/PromptList',
  component: PromptList,
  args: {
    workspaceRoot: '/Users/dev/repos/example-app',
    selectedOrder: undefined,
    selectionRef,
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

// Click a heading to fold its section away. The subtotal is in the heading, so a folded section
// still says what it costs.
export const Collapsible: Story = {
  args: { files: allPromptFiles }
};
