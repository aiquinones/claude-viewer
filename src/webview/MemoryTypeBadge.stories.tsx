import type { Meta, StoryObj } from '@storybook/react-vite';
import { MEMORY_TYPES } from '../model/types';
import { MemoryTypeBadge } from './MemoryTypeBadge';

const meta: Meta<typeof MemoryTypeBadge> = {
  title: 'Memory/MemoryTypeBadge',
  component: MemoryTypeBadge
};

export default meta;

type Story = StoryObj<typeof MemoryTypeBadge>;

export const EveryType: Story = {
  render: () => (
    <div className="flex gap-2 p-4">
      {MEMORY_TYPES.map((type) => (
        <MemoryTypeBadge key={type} type={type} />
      ))}
    </div>
  )
};

// A file whose metadata.type is a word this doesn't know. The badge prints what it said rather than
// hiding it behind "untyped".
export const Declared: Story = {
  args: { type: undefined, declaredType: 'preference' }
};

// No metadata.type at all.
export const Untyped: Story = {
  args: { type: undefined }
};
