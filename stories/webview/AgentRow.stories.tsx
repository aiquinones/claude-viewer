import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { AgentRow } from '@src/webview/AgentRow';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import {
  askingAgent,
  copilotBlockedAgent,
  copilotMcpAgent,
  copilotSubagentAgent,
  copilotWorkingAgent,
  elsewhereAgent,
  idleAgent,
  longTitleAgent,
  noTranscriptAgent,
  resumedAgent,
  waitingAgent,
  workingAgent
} from '../agent-fixtures';
import { WORKSPACE } from '../fixtures';
import { stageNames } from '../session-detail-fixtures';

// One row per state. `now` is a prop rather than a clock in here, so a story can pin the age it
// wants to show — the view is what ticks.
const meta: Meta<typeof AgentRow> = {
  title: 'Agents/AgentRow',
  component: AgentRow,
  args: {
    now: Date.now(),
    workspaceRoot: WORKSPACE,
    onOpen: () => undefined,
    onAnalyze: () => undefined,
    onOpenLog: () => undefined,
    onCopySessionId: () => undefined,
    onKill: () => undefined
  },
  decorators: [
    // The stage a row prints comes from the stored names, so every story here needs them — a row
    // whose current skill isn't in the map shows no stage, which is the default state and is a
    // story of its own rather than the whole file.
    (Story) => (
      <SettingsProvider settings={{ ...DEFAULT_SETTINGS, stages: { names: stageNames } }}>
        <Story />
      </SettingsProvider>
    ),
    (Story) => (
      <div className="w-full max-w-2xl p-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentRow>;

// Mid-turn, written seconds ago, and no PR — that footer is absent rather than empty. The stage
// beside the age shimmers while the agent is going, and says Build rather than the unnamed skill
// loaded after it.
export const Working: Story = { args: { agent: workingAgent } };

// The same tail shape, seven minutes cold. Nothing on disk says whether it's a permission prompt or
// a long command — the tool name and the age are what let you tell. Also the PR case: a session
// that opened one keeps the link on its row, under the button because an <a> can't sit inside one.
export const Waiting: Story = { args: { agent: waitingAgent } };

// The last turn ended in text. Dimmed, because this one is waiting on you — and the stage keeps
// its label and loses the shimmer, since where a session stopped isn't in progress.
export const Idle: Story = { args: { agent: idleAgent } };

// Truncates rather than wrapping: a row that grows a second line breaks the rhythm of the list.
// This one's skill has no name, so there is no stage — which is what every row looks like until
// someone has named one, and is what leaves the title the full width.
export const LongTitle: Story = { args: { agent: longTitleAgent } };

// A live process with nothing written yet — the warning is the icon beside the badge, and the label
// falls back to the folder.
export const NoTranscript: Story = { args: { agent: noTranscriptAgent } };

// A second process on the same conversation, which `--resume` leaves behind. The red flag beside
// the badge is the only sign — one conversation is still one row.
export const Resumed: Story = { args: { agent: resumedAgent } };

// Working in another repo, so the path prints absolute with the home folded to `~`.
export const OtherWorkspace: Story = { args: { agent: elsewhereAgent } };

// An agent sitting in the open folder prints no path at all: the panel header already says which
// folder this is, and repeating it on every row said nothing. `Waiting` above is the worktree case
// — same root, and the path is what tells the two apart.
export const InWorkspaceRoot: Story = { args: { agent: idleAgent } };

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

// Work delegated out. The chevron under the row opens the sub-agents, each with its own purpose,
// its own model and its own bar — and the row's own bar goes on measuring the session, which is the
// bug this shipped with: a sub-agent's requests are filed under the same session id, so the bar used
// to dip to the sub-agent's size and back while one was out.
export const CopilotSubagents: Story = { args: { agent: copilotSubagentAgent } };

// The context bar across its three levels, stacked so the colours can be compared. The Copilot row
// at the bottom is in it deliberately: its number comes from a different file and different
// arithmetic, and the row should give no sign of that.
export const ContextLevels: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map((agent) => (
        <AgentRow {...args} key={agent.sessionId} agent={agent} />
      ))}
    </div>
  )
};
