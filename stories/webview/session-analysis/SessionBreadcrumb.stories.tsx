import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionBreadcrumb } from '@src/webview/session-analysis/SessionBreadcrumb';
import { claudeSession, copilotSession } from '../../session-detail-fixtures';

const meta: Meta<typeof SessionBreadcrumb> = {
  title: 'Usage/SessionBreadcrumb',
  component: SessionBreadcrumb,
  args: {
    session: claudeSession,
    onBack: () => undefined,
    onCopyId: () => undefined,
    onSearch: () => undefined,
    onRefresh: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionBreadcrumb>;

// `Usage › <name>`, and the id under it. Both the arrow and the word Usage go back up one level —
// this is a page inside that surface rather than a surface of its own.
export const Claude: Story = {};

export const Copilot: Story = { args: { session: copilotSession } };

// A session too short to have been given a title falls back to the folder it ran in — 4 of the 89
// sessions measured on one machine.
export const Untitled: Story = {
  args: { session: { ...claudeSession, title: undefined } }
};

// A long title truncates and the id keeps its room. The id is what you'd paste into `--resume`, so
// it doesn't get squeezed out by the name.
export const LongTitle: Story = {
  args: {
    session: {
      ...claudeSession,
      title: 'Read the context window off the last assistant line, then price it against the table'
    }
  }
};
