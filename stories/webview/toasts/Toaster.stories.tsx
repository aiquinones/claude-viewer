import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentTool } from '@src/model/types';
import { Toaster } from '@src/webview/toasts/Toaster';
import { QueuedToast, TOAST_DURATION_MS } from '@src/webview/toasts/toast-message';
import { ToastQueue, useToasts } from '@src/webview/toasts/useToasts';

// The stack is `fixed`, so it pins to the bottom-right of the story frame the way it pins to the
// panel. Every story here holds its own cards rather than running the queue: a card that counted
// down would empty the story six seconds after it loaded. `Live` is the one that counts, and it's
// where the arrival, the fill and the collapse are actually visible.

const card = (
  overrides: Partial<QueuedToast> & Pick<QueuedToast, 'id' | 'title'>
): QueuedToast => ({
  detail: 'Went idle in example-app',
  tool: 'claude',
  durationMs: TOAST_DURATION_MS,
  leaving: false,
  sessionId: `session-${overrides.id}`,
  ...overrides
});

// A queue that holds still: dismissing does nothing, so what's on screen is what the story named.
const held = (toasts: QueuedToast[]): ToastQueue => ({
  toasts,
  push: () => undefined,
  dismiss: () => undefined,
  paused: false,
  setPaused: () => undefined
});

const TOOLS: AgentTool[] = ['claude', 'copilot', 'codex'];

const meta: Meta<typeof Toaster> = {
  title: 'Panel/Toaster',
  component: Toaster,
  args: { onOpenAgent: () => undefined },
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof Toaster>;

// One agent finished. The name is the session's own, the line under it says where it was working,
// and the bar across the bottom is how long before it goes.
export const One: Story = {
  args: { queue: held([card({ id: '1', title: 'Wire the usage poll to the surface' })]) }
};

// Newest on top. Three tools, because the mark is the only thing on the card saying which CLI this
// was — same rule the rows follow.
export const Several: Story = {
  args: {
    queue: held(
      TOOLS.map((tool, index) =>
        card({
          id: `${index}`,
          title: ['Rebuild the flow view', 'Fix the copilot tail', 'Draft the release notes'][index],
          tool
        })
      )
    )
  }
};

// Past the panel's height the pile scrolls, and the container still isn't visible — there's no box
// around the cards, only the cards.
export const Scrolling: Story = {
  args: {
    queue: held(
      Array.from({ length: 12 }, (_, index) =>
        card({ id: `${index}`, title: `Session ${12 - index}`, tool: TOOLS[index % 3] })
      )
    )
  }
};

// A title long enough to need the truncation. It stays one line — a card that grows to two breaks
// the rhythm the same way a row does.
export const LongTitle: Story = {
  args: {
    queue: held([
      card({
        id: '1',
        title: 'Work out why the usage scan re-reads every transcript on a settings change',
        detail: 'Went idle in claude-viewer'
      })
    ])
  }
};

// No session behind it, so the card is text and the ✕ — no hover, no cursor, nowhere to go. What a
// producer other than the idle watcher would push.
export const NotClickable: Story = {
  args: {
    queue: held([
      card({ id: '1', title: 'Skills reloaded', detail: '38 skills, 2 shadowed', sessionId: undefined })
    ])
  }
};

// The real queue, on a button. The only place the arrival, the countdown, the hover pause and the
// collapse can be watched — every other story here is a still frame.
export const Live: Story = {
  render: (args) => <LiveStack onOpenAgent={args.onOpenAgent} />
};

interface LiveStackProps {
  onOpenAgent: (sessionId: string) => void;
}

const LiveStack = ({ onOpenAgent }: LiveStackProps) => {
  const queue: ToastQueue = useToasts();
  const [count, setCount] = useState<number>(0);

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
          queue.push({
            title: `Session ${count + 1}`,
            detail: 'Went idle in example-app',
            tool: TOOLS[count % 3],
            sessionId: `session-${count + 1}`
          });
        }}
        className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
      >
        Notify
      </button>
      <Toaster queue={queue} onOpenAgent={onOpenAgent} />
    </div>
  );
};
