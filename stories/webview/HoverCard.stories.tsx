import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardBody, HoverCardTitle } from '@src/webview/HoverCard';
import { STICKY_ROW_CLASS } from '@src/webview/markdown/Markdown';
import { Z } from '@src/webview/z-layers';

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


// The shape every pane with a markdown body has: a row, and under it a bar pinned at
// `Z.stickyTop`. The card drops down across that bar, so it has to be on a layer above it — at the
// same number the bar would win, being later in the DOM, and the card would go behind the body.
// Hover the trigger: the card must cover the bar.
export const OverAPinnedBar: Story = {
  decorators: [
    (Story) => (
      <div style={{ zIndex: Z.contained }} className="relative h-64 overflow-y-auto p-6">
        <Story />
        <div
          style={{ zIndex: Z.stickyTop }}
          className={`sticky top-0 mt-2 flex ${STICKY_ROW_CLASS} items-center border-y border-border bg-background text-xs text-muted-foreground`}
        >
          a pinned bar, the way a file path or a heading is
        </div>
        <p className="pt-2 text-sm text-muted-foreground">
          {'the body under it. '.repeat(40)}
        </p>
      </div>
    )
  ]
};

// Inside an uppercase, semibold, wide-tracked heading — the shape the retention (i) sits in on the
// Sessions tab. The card is a descendant of that heading and typography inherits, so the whole
// explanation used to be set in the heading's face while the identical card on a plain control
// beside it was not. The box resets all three; the title puts its own weight back.
export const InsideAHeading: Story = {
  decorators: [
    (Story) => (
      <h2 className="flex items-center gap-1.5 p-6 pb-40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        the last 12 weeks
        <Story />
      </h2>
    )
  ]
};

// A card you can reach with the pointer. The default is `pointer-events-none`, which is right for a
// label and fatal for one holding a button — this variant swaps that for `invisible`, so the card
// takes the pointer while it's open and keeps its button out of the tab order while it isn't.
export const Interactive: Story = {
  args: {
    interactive: true,
    card: (
      <span>
        <HoverCardTitle>Standard estimator</HoverCardTitle>
        <HoverCardBody>Characters divided by four.</HoverCardBody>
        <button type="button" className="mt-2 block cursor-pointer text-link hover:underline">
          Edit token estimator
        </button>
      </span>
    )
  }
};
