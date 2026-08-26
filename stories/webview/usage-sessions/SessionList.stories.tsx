import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionList } from '@src/webview/usage-sessions/SessionList';
import { busyYear, emptyHistory, quietHistory } from '../../usage-history-fixtures';
import { workingAgent } from '../../agent-fixtures';

const meta: Meta<typeof SessionList> = {
  title: 'Usage/SessionList',
  component: SessionList,
  args: {
    sessions: busyYear.sessions,
    agents: [{ ...workingAgent, sessionId: 'session-0' }],
    now: Date.now(),
    onOpen: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-4">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SessionList>;

// Two dozen sessions in a box with a height: the list scrolls inside it, so the grid above it on the
// surface stays where it is however many sessions there are.
export const Many: Story = {};

// Fewer rows than the box is tall, which is the case that has to not leave a gap at the bottom.
export const Few: Story = { args: { sessions: quietHistory.sessions } };

// The workspace scope with nothing under it. The copy points at the scope, since that's the thing
// most likely to be why.
export const Empty: Story = { args: { sessions: emptyHistory.sessions } };

// A name and a branch competing for one row. The name truncates first — it's the thing the search
// box already narrows, and the branch is what tells two sessions with the same name apart.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
