import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardBody, HoverCardTitle } from './HoverCard';

// The card only exists on hover, so every story here is something to point at.
const meta: Meta<typeof HoverCard> = {
  title: 'Skills/HoverCard',
  component: HoverCard,
  args: {
    card: (
      <>
        <HoverCardTitle>Inferred</HoverCardTitle>
        <HoverCardBody>
          Copilot announces a skill and never closes it, so it claims every turn until the next one
          or the end of the session.
        </HoverCardBody>
      </>
    ),
    children: (
      <span className="cursor-default rounded border border-border px-1.5 text-xs">hover me</span>
    )
  },
  decorators: [
    (Story) => (
      <div className="p-6 pb-40">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {};

// A hint of two words gets a box of two words. The width is `w-max` up to 16rem, so cards aren't all
// as wide as the longest one.
export const Short: Story = { args: { card: <HoverCardBody>Last 24 hours</HoverCardBody> } };

// Against the right edge, where a card pinned to `left-0` would be cut off by the panel. It measures
// its trigger on the way in and opens the other way instead — and in a webview the panel is the
// viewport, so this is about a dock width rather than a screen.
export const NearTheRightEdge: Story = {
  decorators: [
    (Story) => (
      <div className="flex justify-end p-6 pb-40">
        <Story />
      </div>
    )
  ]
};
