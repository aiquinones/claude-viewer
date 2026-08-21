import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRow } from './MemoryRow';
import {
  feedbackMemory,
  referenceMemory,
  unindexedMemory,
  untypedMemory,
  userMemory
} from './memory-fixtures';

// The view ages rows against the snapshot's own clock rather than a live one, so the stories pass
// the same fixed instant the fixtures are written relative to.
const NOW: number = Date.UTC(2026, 7, 1);

const meta: Meta<typeof MemoryRow> = {
  title: 'Memory/MemoryRow',
  component: MemoryRow,
  args: { selected: false, now: NOW, onSelect: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[560px] px-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MemoryRow>;

export const Default: Story = {
  args: { memory: feedbackMemory }
};

export const Selected: Story = {
  args: { memory: userMemory, selected: true }
};

// Written, and no line in MEMORY.md points at it — so no session will ever read it. The row says so
// before you open it, which is the point of the surface.
export const NotIndexed: Story = {
  args: { memory: unindexedMemory }
};

// A type nothing recognises and no description. It still renders — degrade, don't drop.
export const Untyped: Story = {
  args: { memory: untypedMemory }
};

// The quiet end of the four types, and the oldest row here.
export const Reference: Story = {
  args: { memory: referenceMemory }
};
