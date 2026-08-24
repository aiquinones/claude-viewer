import type { Meta, StoryObj } from '@storybook/react-vite';
import { RetentionInfo } from '@src/webview/usage-sessions/RetentionInfo';

const meta: Meta<typeof RetentionInfo> = {
  title: 'Usage/RetentionInfo',
  component: RetentionInfo,
  args: {
    retention: { days: 30, source: 'default' },
    workspaceRoot: '/Users/dev/repos/example-app',
    // Nothing on disk older than the sweep, which is the ordinary case.
    oldestClaudeDays: 3
  },
  decorators: [
    (Story) => (
      // Room below it, since the card opens downward and these stories are about the card.
      //
      // The heading is the real one, uppercase and all: the card is a descendant of it and
      // typography inherits, so this is the context that decides how the card reads. `HoverCard`
      // resets its own — before that, every sentence here was set in the heading's face.
      <div className="p-4 pb-64">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Last 5 weeks
          <Story />
        </h2>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof RetentionInfo>;

// Focus is the keyboard half of the same disclosure, so focusing the icon shows what a hover shows.
// Same trick as the budgets card's stories, which is the other (i) on a heading.
const openCard = ({ canvasElement }: { canvasElement: HTMLElement }): void => {
  const trigger: HTMLElement | null = canvasElement.querySelector('[aria-label]');
  trigger?.focus();
};

// The icon alone. The card is hover-only, so the stories below focus it instead.
export const Closed: Story = {};

// Nothing set, so the window is Claude Code's documented default. The card says "default" rather
// than naming a file, because there isn't one to name.
export const Default: Story = { play: openCard };

// Someone set it themselves. The card names the file, which is what makes the number arguable.
export const SetByYou: Story = {
  play: openCard,
  args: {
    retention: { days: 7, source: 'user', path: '/Users/dev/.claude/settings.json' },
    oldestClaudeDays: 3
  }
};

// A managed policy. Same sentence shape, and the one source you can't do anything about — worth
// saying plainly rather than implying it's a preference.
export const Managed: Story = {
  play: openCard,
  args: {
    retention: {
      days: 14,
      source: 'managed',
      path: '/Library/Application Support/ClaudeCode/managed-settings.json'
    },
    oldestClaudeDays: 5
  }
};

// The grid is wider than the retention period, which only happens when a resumed session kept an
// older transcript alive. The last paragraph changes to say so.
export const ReachesPastTheSweep: Story = { play: openCard, args: { oldestClaudeDays: 96 } };
