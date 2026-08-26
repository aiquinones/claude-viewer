import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, ReactNode } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { GridDay } from '@src/webview/usage-sessions/grid';
import { GridDaySummary } from '@src/webview/usage-sessions/GridDaySummary';

// A Wednesday in December, so the card reads the same whatever day the story is opened on.
const AT: number = new Date(2026, 11, 3, 12).getTime();

interface DayArgs {
  claude: number;
  copilot: number;
  // Defaulted, so the stories that predate Codex read unchanged.
  codex?: number;
  at?: number;
}

const day = ({ claude, copilot, codex = 0, at = AT }: DayArgs): GridDay => ({
  day: '2026-12-03',
  at,
  sessions: claude + copilot + codex,
  byTool: { claude, copilot, codex },
  level: Math.min(claude + copilot + codex, 4),
  future: false
});

// The bubble the card is rendered inside, copied from `HoverBubble` rather than imported: this
// story is about what the card says, and the real tooltip wants pixel coordinates to say it at.
const Bubble = ({ children }: { children: ReactNode }) => (
  <div className="w-max whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md">
    {children}
  </div>
);

const meta: Meta<typeof GridDaySummary> = {
  title: 'Usage/GridDaySummary',
  component: GridDaySummary,
  decorators: [
    // The tags are painted from `--agent-*`, and the surrounding grid sets `--surface-accent` —
    // custom properties resolve where they're used, so a story that sets neither draws grey.
    (Story) => (
      <div
        className="usage-grid p-8"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Bubble>
          <Story />
        </Bubble>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof GridDaySummary>;

// The case the card exists for: a day both CLIs worked, on one square of one shade.
export const Mixed: Story = {
  args: { day: day({ claude: 8, copilot: 4 }) }
};

// One CLI. The total line goes — it would be the same number as the row under it, and the row also
// says which tool it was.
export const ClaudeOnly: Story = {
  args: { day: day({ claude: 8, copilot: 0 }) }
};

export const CopilotOnly: Story = {
  args: { day: day({ claude: 0, copilot: 3 }) }
};

// A day nothing ran. No tool rows at all, and the total is the whole card under the date.
export const NothingRan: Story = {
  args: { day: day({ claude: 0, copilot: 0 }) }
};

// One session each, which is what most lit days actually look like. The plurals have to hold.
export const OneEach: Story = {
  args: { day: day({ claude: 1, copilot: 1 }) }
};

// Last year, where the date carries its year and the card is at its widest — which is what the
// tooltip's edge-alignment is measured against.
export const ReachingBackAYear: Story = {
  args: { day: day({ claude: 12, copilot: 9, at: new Date(2025, 8, 24, 12).getTime() }) }
};
