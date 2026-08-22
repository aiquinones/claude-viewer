import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentFlags } from '@src/webview/AgentFlags';
import { noTranscriptAgent, resumedAgent, workingAgent } from '../agent-fixtures';

// The icons that sit beside a row's age. Right-aligned in the decorator, because the bubble hangs
// off the right edge the way it does on a row.
const meta: Meta<typeof AgentFlags> = {
  title: 'Agents/AgentFlags',
  component: AgentFlags,
  decorators: [
    (Story) => (
      <div className="flex justify-end p-6 pb-40">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentFlags>;

// The common case, and the reason this is icons rather than lines of text: most rows have nothing
// to say and render nothing at all.
export const Nothing: Story = { args: { agent: workingAgent } };

// A loader warning. Hover for the sentence — it names a file that doesn't exist yet, which is a
// footnote on a row you opened to read its title.
export const Warning: Story = { args: { agent: noTranscriptAgent } };

// Two processes on one conversation. Red, because the pid on this row isn't the only one and the
// menu's Kill acts on that one alone.
export const DuplicatePid: Story = { args: { agent: resumedAgent } };

// Both at once. They share one cluster and each keeps its own bubble.
export const Both: Story = {
  args: {
    agent: {
      ...resumedAgent,
      issues: [
        {
          severity: 'warning',
          message: 'no transcript on disk yet — nothing has been written for this session'
        }
      ]
    }
  }
};

// An error rather than a warning — the same red as the duplicate flag, told apart by what it says.
export const ErrorIssue: Story = {
  args: {
    agent: {
      ...workingAgent,
      issues: [
        { severity: 'error', message: 'could not read the event log: EACCES permission denied' }
      ]
    }
  }
};
