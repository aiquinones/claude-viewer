import type { Meta, StoryObj } from '@storybook/react-vite';
import { skillMarkdown } from './fixtures';
import { SkillBody } from './SkillBody';

const meta: Meta<typeof SkillBody> = {
  title: 'Skills/SkillBody',
  component: SkillBody,
  args: { body: undefined, error: undefined, loading: false },
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
