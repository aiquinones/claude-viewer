import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentRowFooter } from '@src/webview/AgentRowFooter';
import { copilotSubagentAgent, waitingAgent, workingAgent } from '../agent-fixtures';

// What hangs under a row. Press the chevron — the list is a sibling of the line the PR sits on, so
// it opens across the row's full width rather than beside the link.
const meta: Meta<typeof AgentRowFooter> = {
  title: 'Agents/AgentRowFooter',
  component: AgentRowFooter,
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6 pb-64">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentRowFooter>;

// Both halves: the sub-agents on the left, the PR after them.
export const SubagentsAndPullRequest: Story = { args: { agent: copilotSubagentAgent } };

// A session that opened a PR and has delegated nothing.
export const PullRequestOnly: Story = { args: { agent: waitingAgent } };

// Sub-agents with no PR behind them.
export const SubagentsOnly: Story = {
  args: { agent: { ...copilotSubagentAgent, pullRequest: undefined } }
};

// Neither. The footer is absent rather than empty — an empty line under every row is a line of
// padding nobody asked for.
export const Nothing: Story = { args: { agent: workingAgent } };
