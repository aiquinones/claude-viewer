import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryIndexCard } from '@src/webview/MemoryIndexCard';
import { emptyMemoryIndex, memoryIndex, memoryIndexWithDangling } from '../memory-fixtures';

const meta: Meta<typeof MemoryIndexCard> = {
  title: 'Memory/MemoryIndexCard',
  component: MemoryIndexCard,
  args: { selected: false, onSelect: () => undefined, onOpenFile: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[620px] p-3">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MemoryIndexCard>;

export const Default: Story = {
  args: { index: memoryIndex }
};

// Picked, so its text is rendering below the list — the same state a picked memory row is in.
export const Selected: Story = {
  args: { index: memoryIndex, selected: true }
};

// The second failure mode: a line still spending tokens on a memory that isn't on disk.
export const WithDanglingEntry: Story = {
  args: { index: memoryIndexWithDangling }
};

// No MEMORY.md at all. Whatever is in the directory, no session will read any of it.
export const NoIndexFile: Story = {
  args: {
    index: {
      ...emptyMemoryIndex,
      issues: [
        {
          severity: 'warning',
          message: 'no MEMORY.md — nothing points at these files, so no session will read them'
        }
      ]
    }
  }
};

// A directory nobody has written to yet: no index, and nothing to warn about either.
export const Empty: Story = {
  args: { index: emptyMemoryIndex }
};
