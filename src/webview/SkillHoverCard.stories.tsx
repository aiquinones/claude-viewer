import type { Meta, StoryObj } from '@storybook/react-vite';
import { longDescription, noDescription, plainSkill } from './fixtures';
import { SkillHoverCard } from './SkillHoverCard';

// The card only appears on hover, so every story here is something to hover. Storybook can't press
// the mouse for you — point at the name.
const meta: Meta<typeof SkillHoverCard> = {
  title: 'Skills/SkillHoverCard',
  component: SkillHoverCard,
  args: {
    skill: plainSkill,
    children: <span className="cursor-default text-xs font-medium">hover me</span>
  },
  decorators: [
    (Story) => (
      <div className="p-6 pb-32">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillHoverCard>;

export const Default: Story = {};

// A skill with no description at all. The card still opens and says so — an empty box would read
// as a card that failed to load.
export const NoDescription: Story = { args: { skill: noDescription } };

// The card is a fixed width and wraps, which is the whole reason it isn't `Tooltip`.
export const LongDescription: Story = { args: { skill: longDescription } };
