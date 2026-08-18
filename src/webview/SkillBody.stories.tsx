import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  emptyGraph,
  projectDeploy,
  skillGraph,
  skillMarkdown,
  stepFlow,
  stepMarkdown
} from './fixtures';
import { SkillBody } from './SkillBody';

const meta: Meta<typeof SkillBody> = {
  title: 'Skills/SkillBody',
  component: SkillBody,
  args: {
    mode: 'text',
    blockers: {},
    body: undefined,
    error: undefined,
    loading: false,
    graph: skillGraph,
    flow: stepFlow,
    viewedPath: projectDeploy.path
  },
  decorators: [
    (Story) => (
      <div className="h-screen overflow-y-auto overflow-x-clip">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillBody>;

export const Default: Story = { args: { body: skillMarkdown } };

// The gap between selecting a skill and the host answering. Short, but it exists.
export const Loading: Story = { args: { loading: true } };

// A skill that is nothing but frontmatter.
export const Empty: Story = { args: { body: '\n' } };

export const Unreadable: Story = {
  args: { error: 'EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md' }
};

export const Graph: Story = { args: { mode: 'graph' } };

// Before the host has answered, the toggle is dimmed and the section says what it's waiting on.
export const GraphLoading: Story = {
  args: { mode: 'graph', graph: undefined, blockers: { graph: 'Building the graph…' } }
};

// Nothing names anything — reachable in a one-skill install, and from a story.
export const GraphEmpty: Story = { args: { mode: 'graph', graph: emptyGraph } };

// What the toggle looks like on a skill nothing references.
export const GraphBlocked: Story = {
  args: { body: skillMarkdown, blockers: { graph: 'This skill names no other, and none names it' } }
};

// The third mode, in the section it actually lives in — the heading counts the steps and the
// toggle stays pinned above the canvas.
export const Flow: Story = { args: { mode: 'flow', body: stepMarkdown } };

// A skill whose SKILL.md is prose rather than a sequence. The toggle says so, and the section
// says so too for anyone who got here by staying in flow mode across a selection.
export const FlowBlocked: Story = {
  args: {
    mode: 'flow',
    body: skillMarkdown,
    flow: undefined,
    blockers: { flow: "This skill isn't written as a sequence of steps" }
  }
};
