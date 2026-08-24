import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { HoverBubble } from '@src/webview/HoverBubble';
import { surfaceAccent } from '@src/webview/surfaces';

// The frame the bubble is placed against — in the grid it's the box around the scroller, and its
// width is what decides which way the bubble opens.
const FRAME_PX: number = 420;

// `--grid-cell`, in pixels at a 16px root. Only the marker square uses it; the tooltip is placed
// from the coordinates it's given.
const CELL_PX: number = 10;

interface FrameProps {
  // Where the square is inside the frame, which is what the grid measures and hands over.
  x: number;
  y: number;
  children: string;
}

// A frame with one square in it, so the story is about where the bubble lands rather than about the
// data. The border is the frame's edge: the point of this component is what happens at and past it.
const Frame = ({ x, y, children }: FrameProps) => (
  <div
    className="usage-grid p-10"
    style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
  >
    <div
      className="relative rounded-md border border-dashed border-border"
      style={{ width: FRAME_PX, height: 88 }}
    >
      <span
        className="usage-grid-day level-4 absolute"
        style={{ left: x - CELL_PX / 2, top: y }}
        aria-hidden
      />
      <HoverBubble x={x} y={y} frameWidth={FRAME_PX}>
        {children}
      </HoverBubble>
    </div>
  </div>
);

const meta: Meta<typeof HoverBubble> = {
  title: 'Usage/HoverBubble',
  component: HoverBubble
};

export default meta;

type Story = StoryObj<typeof HoverBubble>;

// Mid-frame: centred over the square it points at.
export const Centred: Story = {
  render: () => (
    <Frame x={210} y={44}>
      148.2k output tokens on Tuesday, June 2
    </Frame>
  )
};

// Near the visible left edge. Centring here would push half the bubble past the panel, which does
// crop — so it left-aligns instead. This is a question about the frame, not about which column the
// square is: a scrolled grid puts week 40 right here.
export const AtTheLeftEdge: Story = {
  render: () => (
    <Frame x={18} y={52}>
      3 sessions on Friday, March 14
    </Frame>
  )
};

// The other end, the one the grid opens on. Right-aligned for the same reason.
export const AtTheRightEdge: Story = {
  render: () => (
    <Frame x={FRAME_PX - 16} y={26}>
      1.2M output tokens on Monday, August 18
    </Frame>
  )
};

// The top row, where the bubble clears the frame entirely. It hangs outside rather than being cut
// off, which is the whole reason it's rendered out here instead of inside the scrolling box.
export const PeekingAboveTheFrame: Story = {
  render: () => (
    <Frame x={200} y={0}>
      No output tokens on Sunday, July 5
    </Frame>
  )
};
