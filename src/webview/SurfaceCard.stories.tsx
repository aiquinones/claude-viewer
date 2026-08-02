import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurfaceCard } from './SurfaceCard';
import { SURFACES } from './surfaces';

// One card per state. The accents come from --vscode-charts-*, so flip the theme toolbar to check
// both — a color that reads well on Dark+ can vanish on Light+.
const meta: Meta<typeof SurfaceCard> = {
  title: 'Landing/SurfaceCard',
  component: SurfaceCard,
  args: { onOpen: () => undefined },
  decorators: [
    (Story) => (
      <div className="grid max-w-md grid-cols-2 gap-4 p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SurfaceCard>;

export const Ready: Story = {
  args: { surface: SURFACES[0], detail: '37 found · 4 shadowed' }
};

// Nothing to show yet: the card is dimmed, badged, and drops its arrow.
export const ComingSoon: Story = {
  args: { surface: SURFACES[1], detail: 'Not built yet' }
};

// A real state on a machine with no skills anywhere — the card still opens.
export const Empty: Story = {
  args: { surface: SURFACES[0], detail: 'None found' }
};
