import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  askingAgent,
  copilotBlockedAgent,
  everyMoodAgents,
  idleAgent,
  longTitleAgent,
  noTranscriptAgent,
  waitingAgent,
  workingAgent
} from './agent-fixtures';
import { AgentRobotRow } from './AgentRobotRow';
import { WORKSPACE } from './fixtures';

// One row of the Robots mode. The colour picker works here with no decorator — with no provider the
// colours live in local state, which is what the context falls back to.
const meta: Meta<typeof AgentRobotRow> = {
  title: 'Agents/AgentRobotRow',
  component: AgentRobotRow,
  args: { workspaceRoot: WORKSPACE, onOpen: () => undefined },
  decorators: [
    (Story) => (
      <div className="p-3">
        <Story />
      </div>
    )
  ],
  // Ages are relative to load, so a row that starts as Working crosses to Waiting on its own after
  // a minute — the same thing the real surface does, and the reason the clock is a prop.
  render: (args) => <AgentRobotRow {...args} now={Date.now()} />
};

export default meta;

type Story = StoryObj<typeof AgentRobotRow>;

export const Working: Story = { args: { agent: workingAgent } };

// A tool call is out with nothing since. Everything but `AskUserQuestion` lands here.
export const Waiting: Story = { args: { agent: waitingAgent } };

// The same `blocked` state, stopped on you instead of on a command.
export const Asking: Story = { args: { agent: askingAgent } };

export const Idle: Story = { args: { agent: idleAgent } };

// Copilot's `blocked` is read off the disk rather than inferred, and it draws the waiting robot —
// its pending tool is a command, so it's waiting on a machine like any other.
export const CopilotBlocked: Story = { args: { agent: copilotBlockedAgent } };

// The title truncates rather than wraps: the robot's height is what sets the row, and a second line
// of title would put the caption somewhere else on every row.
export const LongTitle: Story = { args: { agent: longTitleAgent } };

// No title yet, so the row falls back to the folder — and the issue hangs underneath.
export const NoTranscript: Story = { args: { agent: noTranscriptAgent } };

// The four side by side, which is the arrangement that shows whether the poses read at row size.
export const EveryMood: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      {everyMoodAgents.map((agent) => (
        <AgentRobotRow {...args} key={agent.sessionId} agent={agent} now={Date.now()} />
      ))}
    </div>
  )
};
