import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionRow } from '@src/webview/usage-sessions/SessionRow';
import { copilotSession, oneSession, untitledSession } from '../../usage-history-fixtures';

const meta: Meta<typeof SessionRow> = {
  title: 'Usage/SessionRow',
  component: SessionRow,
  args: {
    session: oneSession,
    workspaceRoot: '/Users/dev/repos/example-app',
    now: Date.now(),
    onOpen: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl divide-y divide-border rounded-lg border border-border">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionRow>;

export const Claude: Story = {};

// The other CLI, wearing the colour it wears on an agent row — one tool is named the same way on
// every surface.
export const Copilot: Story = { args: { session: copilotSession } };

// Claude Code never named this one, which happens to short sessions. The row falls back to the
// folder it ran in rather than showing a bare id.
export const Untitled: Story = { args: { session: untitledSession } };

// A worktree. It prints as its own folder — the scope filter counts it as this workspace, which is
// a different question from what a row is called.
export const InAWorktree: Story = {
  args: {
    session: {
      ...oneSession,
      cwd: '/Users/dev/repos/example-app/.claude/worktrees/feat+grid'
    }
  }
};
