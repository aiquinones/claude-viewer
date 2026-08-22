import type { Meta, StoryObj } from '@storybook/react-vite';
import { AtlasView } from './AtlasView';

// The architecture map, walkable. Open one node straight from the URL:
//   /?path=/story/dev-atlas--map&args=initialPath:host
const meta = {
  title: 'Dev/Atlas',
  component: AtlasView,
  parameters: { layout: 'fullscreen' },
  args: { initialPath: '' }
} satisfies Meta<typeof AtlasView>;

export default meta;

type Story = StoryObj<typeof meta>;

// The top of the map: the two bundles, the wire, and what sits between them.
export const Map: Story = {};

// One level down, to check a node that only lists its children.
export const Host: Story = {
  args: { initialPath: 'host' }
};

// A leaf — nothing under it yet, which is the state most nodes start in.
export const Undrawn: Story = {
  args: { initialPath: 'host/stores' }
};
