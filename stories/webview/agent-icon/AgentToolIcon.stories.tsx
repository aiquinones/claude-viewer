import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { AGENT_TOOLS } from '@src/model/types';
import { AGENT_ICON_SIZES, AgentToolIcon } from '@src/webview/agent-icon/AgentToolIcon';

const meta: Meta<typeof AgentToolIcon> = {
  title: 'Agents/AgentToolIcon',
  component: AgentToolIcon
};

export default meta;

type Story = StoryObj<typeof AgentToolIcon>;

export const Claude: Story = { args: { tool: 'claude' } };

export const Copilot: Story = { args: { tool: 'copilot' } };

// Side by side, which is the only way to check they're distinguishable from each other and still
// quiet enough not to pull the eye off the title beside them.
export const EveryTool: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {AGENT_TOOLS.map((tool) => (
        <AgentToolIcon key={tool} tool={tool} />
      ))}
    </div>
  )
};

// The three sizes, both marks, in a grid. This is the story the 88% padding on the Copilot viewBox
// was chosen against: the two have to read as the same weight on every row, and `xs` is where a
// mark either survives or turns into a smudge.
export const EverySize: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-4 gap-y-3">
      {AGENT_ICON_SIZES.map((size) => (
        <Fragment key={size}>
          <span className="mono text-[11px] text-muted-foreground">{size}</span>
          {AGENT_TOOLS.map((tool) => (
            <AgentToolIcon key={tool} tool={tool} size={size} />
          ))}
        </Fragment>
      ))}
    </div>
  )
};

// What the grid's hover bubble draws — an 11px line with the smallest mark in front of it, and no
// other text naming the tool. If the mark doesn't carry it here it doesn't carry it anywhere.
export const InABubbleLine: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-[auto_auto] items-center gap-x-1.5 gap-y-0.5 text-[11px]">
      {AGENT_TOOLS.map((tool) => (
        <Fragment key={tool}>
          <AgentToolIcon tool={tool} size="xs" />
          <span className="text-muted-foreground">2 sessions</span>
        </Fragment>
      ))}
    </div>
  )
};
