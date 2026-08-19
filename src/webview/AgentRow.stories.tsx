import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentRow } from './AgentRow';
import {
  askingAgent,
  copilotBlockedAgent,
  copilotMcpAgent,
  copilotWorkingAgent,
  elsewhereAgent,
  idleAgent,
  longTitleAgent,
  noTranscriptAgent,
  waitingAgent,
  workingAgent
} from './agent-fixtures';
import { WORKSPACE } from './fixtures';

// One row per state. `now` is a prop rather than a clock in here, so a story can pin the age it
// wants to show — the view is what ticks.
const meta: Meta<typeof AgentRow> = {
  title: 'Agents/AgentRow',
  component: AgentRow,
  args: {
    now: Date.now(),
    workspaceRoot: WORKSPACE,
    onOpen: () => undefined,
    onOpenLog: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentRow>;

// Mid-turn, written seconds ago, and no PR — that footer is absent rather than empty.
export const Working: Story = { args: { agent: workingAgent } };

// The same tail shape, seven minutes cold. Nothing on disk says whether it's a permission prompt or
// a long command — the tool name and the age are what let you tell. Also the PR case: a session
// that opened one keeps the link on its row, under the button because an <a> can't sit inside one.
export const Waiting: Story = { args: { agent: waitingAgent } };

// The last turn ended in text. Dimmed, because this one is waiting on you.
export const Idle: Story = { args: { agent: idleAgent } };

// Truncates rather than wrapping: a row that grows a second line breaks the rhythm of the list.
export const LongTitle: Story = { args: { agent: longTitleAgent } };

// A live process with nothing written yet — the issue shows under the row, and the label falls back
// to the folder.
export const NoTranscript: Story = { args: { agent: noTranscriptAgent } };

// Working in another repo, so the path prints absolute with the home folded to `~`.
export const OtherWorkspace: Story = { args: { agent: elsewhereAgent } };

// A Copilot row next to the Claude ones above: same shape, different tag, plus the branch that
// only this CLI records.
export const CopilotWorking: Story = { args: { agent: copilotWorkingAgent } };

// The state Claude can't express. This row says Waiting six seconds in, because the log carries an
// unanswered permission request — a Claude row with the same age would still say Working, and would
// take a minute of silence to change its mind.
export const CopilotBlocked: Story = { args: { agent: copilotBlockedAgent } };

// An MCP tool prints server-qualified, so a remote call doesn't read like a local one. Also the
// no-branch case, which is what a session outside a git repo looks like.
export const CopilotMcpTool: Story = { args: { agent: copilotMcpAgent } };

// The context bar across its three levels, stacked so the colours can be compared. The Copilot row
// at the bottom has no bar — it records no context size anywhere on disk — which is what the gap
// between the rows is saying.
export const ContextLevels: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map((agent) => (
        <AgentRow {...args} key={agent.sessionId} agent={agent} />
      ))}
    </div>
  )
};
