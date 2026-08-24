import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionRow } from '@src/webview/usage-sessions/SessionRow';
import { copilotSession, oneSession, untitledSession } from '../../usage-history-fixtures';

const meta: Meta<typeof SessionRow> = {
  title: 'Usage/SessionRow',
  component: SessionRow,
  args: {
    session: oneSession,
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

// The name, and the branch the session's *latest* turn was on — one that branched, entered a
// worktree and came back to main says where it left off. Where it ran is on the page behind the
// row, not here: this list spans every folder on the machine, so a path on the row is a column of
// paths you weren't asking for.
export const Claude: Story = {};

// The other CLI, wearing the colour it wears on an agent row — one tool is named the same way on
// every surface. Copilot writes its branch once per session, in `workspace.yaml`.
export const Copilot: Story = { args: { session: copilotSession } };

// Claude Code never named this one, which happens to short sessions. The row falls back to the
// folder it ran in rather than showing a bare id — the one place a path still reaches the row, and
// it's standing in for a name.
export const Untitled: Story = { args: { session: untitledSession } };

// A session that ran outside a repo. Nothing to name, so the row is a title over the tool and the
// age, and it has to still look deliberate rather than unfinished.
export const NoBranch: Story = {
  args: { session: { ...oneSession, branch: undefined } }
};

// A name and a branch that both overrun. Each truncates on its own line, and the tool and the age
// keep their place at the right edge.
export const LongNames: Story = {
  args: {
    session: {
      ...oneSession,
      title: 'Read the context window off the last assistant line, then rebuild the bar around it',
      branch: 'feat/session-list-branch-and-folder-and-everything-else'
    }
  }
};
