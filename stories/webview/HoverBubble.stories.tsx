import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { HoverBubble } from '@src/webview/HoverBubble';
import { GridDay } from '@src/webview/usage-sessions/grid';
import { GridDaySummary } from '@src/webview/usage-sessions/GridDaySummary';
import { surfaceAccent } from '@src/webview/surfaces';

// The frame the bubble is placed against — in the grid it's the box around the scroller, and its
// width is what decides which way the bubble opens. Drawn here with a grid square and a day card,
// since that's the caller whose content is several rows tall.
const FRAME_PX: number = 420;

// `--grid-cell`, in pixels at a 16px root. Only the marker square uses it; the tooltip is placed
// from the coordinates it's given.
const CELL_PX: number = 10;

interface DayArgs {
  claude: number;
  copilot: number;
  // Defaulted, so the stories that predate Codex read unchanged.
  codex?: number;
  at: number;
}

const day = ({ claude, copilot, codex = 0, at }: DayArgs): GridDay => ({
  day: new Date(at).toISOString().slice(0, 10),
  at,
  sessions: claude + copilot + codex,
  byTool: { claude, copilot, codex },
  level: Math.min(claude + copilot + codex, 4),
  future: false
});

interface FrameProps {
  // Where the square is inside the frame, which is what the grid measures and hands over.
  x: number;
  y: number;
  day: GridDay;
}

// A frame with one square in it, so the story is about where the bubble lands rather than about the
// data. The border is the frame's edge: the point of this component is what happens at and past it.
const Frame = ({ x, y, day: subject }: FrameProps) => (
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
        <GridDaySummary day={subject} />
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

// Mid-frame: centred over the square it points at. The card is several rows tall now, so this is
// also what says the bubble grows upward from the square rather than downward over the grid.
export const Centred: Story = {
  render: () => (
    <Frame x={210} y={44} day={day({ claude: 8, copilot: 4, at: new Date(2026, 11, 3, 12).getTime() })} />
  )
};

// Near the visible left edge. Centring here would push half the bubble past the panel, which does
// crop — so it left-aligns instead. This is a question about the frame, not about which column the
// square is: a scrolled grid puts week 40 right here.
export const AtTheLeftEdge: Story = {
  render: () => (
    <Frame x={18} y={52} day={day({ claude: 3, copilot: 0, at: new Date(2026, 2, 14, 12).getTime() })} />
  )
};

// The other end, the one the grid opens on. Right-aligned for the same reason.
export const AtTheRightEdge: Story = {
  render: () => (
    <Frame
      x={FRAME_PX - 16}
      y={26}
      day={day({ claude: 2, copilot: 11, at: new Date(2026, 7, 17, 12).getTime() })}
    />
  )
};

// The top row, where the bubble clears the frame entirely. It hangs outside rather than being cut
// off, which is the whole reason it's rendered out here instead of inside the scrolling box.
export const PeekingAboveTheFrame: Story = {
  render: () => (
    <Frame x={200} y={0} day={day({ claude: 0, copilot: 0, at: new Date(2026, 6, 5, 12).getTime() })} />
  )
};
