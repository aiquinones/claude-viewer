import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { UsageHistory } from '@src/model/usage/types';
import { surfaceAccent } from '@src/webview/surfaces';
import { ContributionGrid } from '@src/webview/usage-sessions/ContributionGrid';
import { UsageGrid, buildGrid } from '@src/webview/usage-sessions/grid';
import { busyYear, emptyHistory, quietHistory } from '../../usage-history-fixtures';

// The squares are painted from `--surface-accent`, which the usage view sets on itself — a custom
// property resolves where it's used, so a story that doesn't set it draws the fallback grey.
const OnSurface = ({ history }: { history: UsageHistory }) => {
  const grid: UsageGrid = buildGrid({
    sessions: history.sessions,
    now: Date.now(),
    retentionDays: history.retention.days
  });

  return (
    <div
      className="max-w-3xl p-4"
      style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
    >
      <ContributionGrid grid={grid} />
    </div>
  );
};

const meta: Meta<typeof ContributionGrid> = {
  title: 'Usage/ContributionGrid',
  component: ContributionGrid
};

export default meta;

type Story = StoryObj<typeof ContributionGrid>;

// Months of work thinning out towards the back of the year. Opens scrolled to today, which is the
// right-hand end.
export const Busy: Story = {
  render: () => <OnSurface history={busyYear} />
};

// A handful of days, all recent. The scale is quartiles by rank, so these still take four shades
// between them rather than all landing on the palest one.
export const Quiet: Story = {
  render: () => <OnSurface history={quietHistory} />
};

// Nothing on record. Every square is the empty shade and the readout says so rather than the grid
// looking like it failed to load.
export const Empty: Story = {
  render: () => <OnSurface history={emptyHistory} />
};

// Narrow panel: the grid keeps its 53 columns and the box scrolls sideways, still opening at today.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } },
  render: () => <OnSurface history={busyYear} />
};
