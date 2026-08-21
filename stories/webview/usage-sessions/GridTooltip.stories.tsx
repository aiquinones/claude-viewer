import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { DAYS_PER_WEEK } from '@src/webview/usage-sessions/grid';
import { GridTooltip } from '@src/webview/usage-sessions/GridTooltip';
import { surfaceAccent } from '@src/webview/surfaces';

const WEEKS: number = 14;

// A lattice with nothing in it but the pitch, so the story is about where the bubble lands rather
// than about the data. It's the same classes the grid uses — if the arithmetic and the layout ever
// disagree, they disagree here too.
const Lattice = ({ week, row, children }: { week: number; row: number; children: string }) => (
  <div
    className="usage-grid w-max p-6"
    style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
  >
    <div className="relative">
      <div className="usage-grid-weeks flex">
        {Array.from({ length: WEEKS }, (_, column) => (
          <div key={column} className="usage-grid-days flex flex-col">
            {Array.from({ length: DAYS_PER_WEEK }, (_, day) => (
              <span
                key={day}
                className={`usage-grid-day ${column === week && day === row ? 'level-4' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <GridTooltip week={week} row={row} weeks={WEEKS}>
        {children}
      </GridTooltip>
    </div>
  </div>
);

const meta: Meta<typeof GridTooltip> = {
  title: 'Usage/GridTooltip',
  component: GridTooltip
};

export default meta;

type Story = StoryObj<typeof GridTooltip>;

// Mid-grid: centred over the square it points at.
export const Centred: Story = {
  render: () => (
    <Lattice week={7} row={3}>
      148.2k output tokens on Tuesday, June 2
    </Lattice>
  )
};

// The first column. Centring here would hang half the bubble outside the scroll box, which crops
// rather than extends — so it left-aligns instead.
export const AtTheLeftEdge: Story = {
  render: () => (
    <Lattice week={0} row={5}>
      3 sessions on Friday, March 14
    </Lattice>
  )
};

// The last column, the one the grid opens on. Right-aligned for the same reason.
export const AtTheRightEdge: Story = {
  render: () => (
    <Lattice week={WEEKS - 1} row={1}>
      1.2M output tokens on Monday, August 18
    </Lattice>
  )
};

// The top row, where the bubble sits above the grid entirely — the box has padding for it.
export const TopRow: Story = {
  render: () => (
    <Lattice week={6} row={0}>
      No output tokens on Sunday, July 5
    </Lattice>
  )
};
