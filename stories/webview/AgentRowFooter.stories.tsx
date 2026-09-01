import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentRowFooter } from '@src/webview/AgentRowFooter';
import {
  copilotSubagentAgent,
  deliverableAgent,
  longDeliverableAgent,
  waitingAgent,
  workingAgent
} from '../agent-fixtures';

// What hangs under a row. Press the chevron — the list is a sibling of the line the PR sits on, so
// it opens across the row's full width rather than beside the link.
const meta: Meta<typeof AgentRowFooter> = {
  title: 'Agents/AgentRowFooter',
  component: AgentRowFooter,
  args: { onOpenDeliverable: () => undefined },
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

// What a session announced it produced, after the PR the panel found on its own.
export const Deliverables: Story = { args: { agent: deliverableAgent } };

// Declared things and no PR — the row a session gets before it has opened one.
export const DeliverablesOnly: Story = {
  args: { agent: { ...deliverableAgent, pullRequest: undefined } }
};

// A title long enough to hit the chip's cap. An agent writes these, and nothing bounds what it
// writes.
export const LongDeliverableTitle: Story = { args: { agent: longDeliverableAgent } };

// Neither. The footer is absent rather than empty — an empty line under every row is a line of
// padding nobody asked for.
export const Nothing: Story = { args: { agent: workingAgent } };
