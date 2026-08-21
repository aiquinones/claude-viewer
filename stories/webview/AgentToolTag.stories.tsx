import type { Meta, StoryObj } from '@storybook/react-vite';
import { AGENT_TOOLS } from '@src/model/types';
import { AgentToolTag } from '@src/webview/AgentToolTag';

const meta: Meta<typeof AgentToolTag> = {
  title: 'Agents/AgentToolTag',
  component: AgentToolTag
};

export default meta;

type Story = StoryObj<typeof AgentToolTag>;

export const Claude: Story = { args: { tool: 'claude' } };

export const Copilot: Story = { args: { tool: 'copilot' } };

// Side by side, which is the only way to check they're distinguishable from each other and still
// quiet enough not to pull the eye off the title above them.
export const EveryTool: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {AGENT_TOOLS.map((tool) => (
        <AgentToolTag key={tool} tool={tool} />
      ))}
    </div>
  )
};
