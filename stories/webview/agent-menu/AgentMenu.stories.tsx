import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentMenu } from '@src/webview/agent-menu/AgentMenu';
import { copilotWorkingAgent, workingAgent } from '../../agent-fixtures';

// The commands on one agent row. Opened here at a fixed point rather than by a right-click, so both
// of its states are somewhere you can look at them — the confirm is behind a press in the real
// panel and would otherwise only exist in a screenshot.
//
// It positions itself in client coordinates, which is what the padding on the decorator is for: an
// anchor near the top-left is the case where nothing has to flip.
const meta: Meta<typeof AgentMenu> = {
  title: 'Agents/AgentMenu',
  component: AgentMenu,
  args: {
    agent: workingAgent,
    anchor: { x: 40, y: 40 },
    onClose: () => undefined,
    onOpenLog: () => undefined,
    onCopySessionId: () => undefined,
    onKill: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentMenu>;

// The three commands, one line each. The value a command acts on — the head of the session id, the
// pid — sits beside its label rather than under it.
export const Default: Story = {};

// A Copilot row. The menu is the same three commands: both CLIs write a log, carry a session id and
// run in a process, which is the whole reason this isn't per-tool.
export const Copilot: Story = { args: { agent: copilotWorkingAgent } };

// Opened near the bottom-right corner, where the menu has to flip to the other side of the pointer
// rather than hang off the panel.
export const NearTheEdge: Story = {
  args: { anchor: { x: 1000, y: 620 } }
};

// The second press. It replaces the menu rather than opening over it, so there's nothing behind to
// mis-click, and it says what you lose rather than only that the button is serious. Cancel sits
// nearest the pointer, which is still where the kill item was.
export const Confirming: Story = { args: { initialConfirming: true } };
