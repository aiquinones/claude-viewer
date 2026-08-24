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

// A worktree, which is what `oneSession` runs in: its branch and the folder saying which worktree,
// side by side. Both come off the session's *latest* turn — one that branched, entered a worktree
// and came back to main says where it left off.
export const Claude: Story = {};

// The other CLI, wearing the colour it wears on an agent row — one tool is named the same way on
// every surface. Copilot writes its branch once per session, in `workspace.yaml`.
export const Copilot: Story = { args: { session: copilotSession } };

// Claude Code never named this one, which happens to short sessions. The row falls back to the
// folder it ran in rather than showing a bare id.
export const Untitled: Story = { args: { session: untitledSession } };

// The open folder, so the folder is dropped: the surface header already said which one it is, and
// printing it on every row says nothing. The branch is what's left, and it's what differs between
// two sessions in the same directory.
export const InTheOpenFolder: Story = {
  args: { session: { ...oneSession, cwd: '/Users/dev/repos/example-app' } }
};

// A session that ran outside a repo. Nothing to name, so the row is a title over a folder — the row
// as it was before branches, and it has to still look deliberate.
export const NoBranch: Story = {
  args: { session: { ...oneSession, branch: undefined } }
};

// Both flexible fields at once, under a name that doesn't fit either. Everything truncates and the
// tool and the age keep their place at the right edge.
export const LongNames: Story = {
  args: {
    session: {
      ...oneSession,
      title: 'Read the context window off the last assistant line, then rebuild the bar around it',
      branch: 'feat/session-list-branch-and-folder-and-everything-else',
      cwd: '/Users/dev/repos/example-app/.claude/worktrees/feat+session-list-branch'
    }
  }
};
