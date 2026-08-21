import type { Meta, StoryObj } from '@storybook/react-vite';
import { memoryMarkdown } from './fixtures';
import { MemoryBody } from './MemoryBody';
import { feedbackMemory, linkedMemory, untypedMemory } from './memory-fixtures';

const meta: Meta<typeof MemoryBody> = {
  title: 'Memory/MemoryBody',
  component: MemoryBody,
  args: {
    body: memoryMarkdown,
    error: undefined,
    loading: false,
    onOpenLink: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-[620px] overflow-y-auto">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MemoryBody>;

export const Default: Story = {
  args: { memory: feedbackMemory }
};

// A link to a memory nobody has written yet. Dimmed rather than flagged — the instructions say a
// link with no target marks something worth writing later.
export const UnresolvedLink: Story = {
  args: { memory: linkedMemory }
};

export const Loading: Story = {
  args: { memory: feedbackMemory, body: undefined, loading: true }
};

export const ReadFailed: Story = {
  args: { memory: feedbackMemory, body: undefined, error: 'EACCES: permission denied' }
};

// No description above the text, because the file didn't carry one.
export const NoDescription: Story = {
  args: { memory: untypedMemory }
};
