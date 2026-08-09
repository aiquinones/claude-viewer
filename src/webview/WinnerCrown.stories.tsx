import type { Meta, StoryObj } from '@storybook/react-vite';
import { WinnerCrown } from './WinnerCrown';
import { pluginDeploy, userDeploy } from './fixtures';

const meta: Meta<typeof WinnerCrown> = {
  title: 'Skills/WinnerCrown',
  component: WinnerCrown,
  args: { onSelectSkill: () => undefined },
  // Room below the crown for the card, and a heading beside it for the size it sits at in the
  // detail header.
  decorators: [
    (Story) => (
      <div className="flex items-center gap-2 p-6 pb-64">
        <h1 className="text-base font-semibold">deploy</h1>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof WinnerCrown>;

// Focus is the keyboard half of the same disclosure, so focusing the crown shows what a hover
// shows. No addon needed to fake a pseudo-class.
const openCard = ({ canvasElement }: { canvasElement: HTMLElement }): void => {
  const trigger: HTMLElement | null = canvasElement.querySelector('[aria-describedby]');
  trigger?.focus();
};

// The crown alone. The card is hover-only, so the stories below focus it instead.
export const Closed: Story = {
  args: { shadowed: [userDeploy] }
};

export const OpenOverOne: Story = {
  args: { shadowed: [userDeploy] },
  play: openCard
};

// Several losers — checks the plural and that the links stack.
export const OpenOverSeveral: Story = {
  args: { shadowed: [userDeploy, pluginDeploy] },
  play: openCard
};

// No collision: renders nothing.
export const NoCollision: Story = {
  args: { shadowed: [] }
};
