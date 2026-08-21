import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryList } from './MemoryList';
import { allMemories, feedbackMemory, untypedMemory, userMemory } from './memory-fixtures';

// In the panel this belongs to the view, which scrolls back to whatever it lands on. Nothing here
// reads it — the stories only have to hand the list something to attach.
const selectionRef = createRef<HTMLDivElement>();

const NOW: number = Date.UTC(2026, 7, 1);

const meta: Meta<typeof MemoryList> = {
  title: 'Memory/MemoryList',
  component: MemoryList,
  args: {
    selectedPath: undefined,
    now: NOW,
    selectionRef,
    onSelect: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-[620px] px-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MemoryList>;

export const Default: Story = {
  args: { memories: allMemories }
};

// One group only — a type nobody has written gets no heading rather than an empty one.
export const OneType: Story = {
  args: { memories: [feedbackMemory] }
};

// The untyped group is last on purpose: it's the one to look at.
export const UntypedOnly: Story = {
  args: { memories: [untypedMemory] }
};

export const WithSelection: Story = {
  args: { memories: allMemories, selectedPath: userMemory.path }
};

// Click a heading to fold its group away. The subtotal is in the heading, so a folded group still
// says what it costs.
export const Collapsible: Story = {
  args: { memories: allMemories }
};

export const Empty: Story = {
  args: { memories: [] }
};
