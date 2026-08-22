import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { Button } from '@src/webview/components/ui/button';
import { Tooltip } from '@src/webview/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Chrome/Tooltip',
  component: Tooltip,
  // The bubble only appears on hover or focus, so the stories leave room under the trigger.
  decorators: [
    (Story) => (
      <div className="flex justify-end p-6 pb-24">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const WithShortcut: Story = {
  args: {
    label: 'Search',
    hint: '⌘F',
    children: (
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search />
      </Button>
    )
  }
};

export const LabelOnly: Story = {
  args: {
    label: 'Refresh',
    children: (
      <Button variant="ghost" size="icon" aria-label="Refresh">
        <Search />
      </Button>
    )
  }
};

// A label that's a sentence rather than a name. Without `wrap` this runs off the panel's edge in
// one line, which is what the agent rows' flags needed.
export const Wrapped: Story = {
  args: {
    label: 'no event log on disk yet — nothing has been written for this session',
    wrap: true,
    children: (
      <Button variant="ghost" size="icon" aria-label="Warning">
        <Search />
      </Button>
    )
  }
};

// What the color picker does while its swatches are open — the trigger keeps its tooltip, the
// tooltip just doesn't draw.
export const Disabled: Story = {
  args: {
    label: 'Refresh',
    disabled: true,
    children: (
      <Button variant="ghost" size="icon" aria-label="Refresh">
        <Search />
      </Button>
    )
  }
};
