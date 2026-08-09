import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurfaceCard } from './SurfaceCard';
import { SURFACES } from './surfaces';

// One card per state. The accents come from --vscode-charts-*, so flip the theme toolbar to check
// both — a color that reads well on Dark+ can vanish on Light+.
const meta: Meta<typeof SurfaceCard> = {
  title: 'Landing/SurfaceCard',
  component: SurfaceCard,
  args: { onOpen: () => undefined },
  // The same grid LandingView puts the cards in, so a story shows the shape the card really gets.
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 p-6 sm:grid-cols-2">
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

// One card across, which is what the panel gets under 640px. It sizes to its content instead of
// taking the 4:3 ratio, so a wider panel doesn't make it taller.
export const Stacked: Story = {
  args: { surface: SURFACES[0], detail: '37 found · 4 shadowed' },
  globals: { viewport: { value: 'narrowPanel' } }
};

// A real state on a machine with no skills anywhere — the card still opens.
export const Empty: Story = {
  args: { surface: SURFACES[0], detail: 'None found' }
};
