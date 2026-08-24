import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { SessionsTab } from '@src/webview/usage-sessions/SessionsTab';
import {
  busyYear,
  copilotOnlyHistory,
  emptyHistory,
  mixedDayHistory,
  quietHistory
} from '../../usage-history-fixtures';

const meta: Meta<typeof SessionsTab> = {
  title: 'Usage/SessionsTab',
  component: SessionsTab,
  args: {
    history: busyYear,
    workspaceRoot: '/Users/dev/repos/example-app',
    onOpenSession: () => undefined
  },
  decorators: [
    // The squares are painted from `--surface-accent`, which the usage view sets on itself — a
    // custom property resolves where it's used, so a story that doesn't set it draws grey.
    (Story) => (
      <div
        className="max-w-3xl"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionsTab>;

// Both CLIs on one run of squares. Claude is on the wall, so the heading carries the (i) that
// explains where the window's left edge comes from.
export const Mixed: Story = {};

// A day both tools worked. One square, one shade — the split is the tooltip's, which is the whole
// reason the grid can be merged at all.
export const MixedDay: Story = {
  args: { history: mixedDayHistory }
};

// A machine that has only ever run Copilot. Nothing here is subject to `cleanupPeriodDays`, so the
// heading drops the (i) rather than explaining a sweep that governs none of the squares.
export const CopilotOnly: Story = {
  args: { history: copilotOnlyHistory }
};

// A handful of days, all recent, all Claude. The (i) is back.
export const Quiet: Story = {
  args: { history: quietHistory }
};

// Nothing on record. The grid draws its window as holes and says so, and there is no Claude data to
// hang the (i) on.
export const Empty: Story = {
  args: { history: emptyHistory }
};

// Before the history pass lands. This tab is what starts it, so the wait is its own.
export const Scanning: Story = {
  args: { history: undefined }
};

// Narrow panel: the grid keeps its columns and the box scrolls sideways, still opening at today.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
