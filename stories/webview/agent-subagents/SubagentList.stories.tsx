import type { Meta, StoryObj } from '@storybook/react-vite';
import { SubagentList } from '@src/webview/agent-subagents/SubagentList';
import { subagents } from '../../agent-fixtures';

// Hover a bar for the card — it's the row's own `AgentContext`, so a sub-agent's context reads the
// same as the session's. The padding at the foot is room for that card to open into.
const meta: Meta<typeof SubagentList> = {
  title: 'Agents/SubagentList',
  component: SubagentList,
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6 pb-64">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SubagentList>;

// Three at once, which is what a session that fans work out looks like. The second has finished no
// request yet and draws no bar; the third has no purpose, the state of one whose `task` call fell
// outside the window read.
export const Several: Story = { args: { subagents } };

// The common case — one sub-agent out, labelled, measured.
export const One: Story = { args: { subagents: subagents.slice(0, 1) } };

// A sub-agent seconds old. It exists and has measured nothing, so the row is its name and its
// model: an empty track would claim its context was empty.
export const NothingMeasuredYet: Story = { args: { subagents: subagents.slice(1, 2) } };

// A purpose longer than the panel is wide. It truncates rather than wrapping — the model stays
// pinned to the right edge, which is the column the eye reads down.
export const LongPurpose: Story = {
  args: {
    subagents: [
      {
        ...subagents[0],
        purpose:
          'Find every place the retry budget is read, including the two test helpers that set it by hand, and report the call sites'
      }
    ]
  }
};
