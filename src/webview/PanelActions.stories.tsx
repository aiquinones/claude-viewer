import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelActions } from './PanelActions';

const meta: Meta<typeof PanelActions> = {
  title: 'Chrome/PanelActions',
  component: PanelActions,
  args: { onSearch: () => undefined, onRefresh: () => undefined },
  // Right-aligned with room below, the way it sits at the end of a view's header.
  decorators: [
    (Story) => (
      <div className="flex justify-end p-6 pb-24">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PanelActions>;

// Hover either button for its tooltip; the magnifier's carries the chord.
export const Default: Story = {
  args: {}
};
