import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackingView } from './TrackingView';
import { loadTrackedItems } from './load-tracked';
import { TrackedItem } from './tracked-items';

// The real `tracking/ideas/` folder, not a fixture — this one is a tool for reading the notes,
// so synthetic ones would defeat it. Editing a note re-renders this: Vite watches every file the
// glob matched, and the invalidation propagates here.
const items: TrackedItem[] = loadTrackedItems();

// Open one item straight from the URL:
//   /?path=/story/dev-tracking--all&args=initialId:some-item-id
const meta = {
  title: 'Dev/Tracking',
  component: TrackingView,
  parameters: { layout: 'fullscreen' },
  args: { items, initialId: '' }
} satisfies Meta<typeof TrackingView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {};

// What a fresh clone sees: `tracking/` is gitignored, so the glob matches nothing.
export const Empty: Story = {
  args: { items: [] }
};
