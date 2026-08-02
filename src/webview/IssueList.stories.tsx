import type { Meta, StoryObj } from '@storybook/react-vite';
import { IssueList } from './IssueList';
import { bothIssues, error, warning } from './fixtures';

const meta: Meta<typeof IssueList> = {
  title: 'Skills/IssueList',
  component: IssueList,
  decorators: [(Story) => <div className="p-6"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof IssueList>;

export const Warning: Story = {
  args: { issues: [warning('no description — Claude has nothing to match against')] }
};

export const Error: Story = {
  args: { issues: [error('no SKILL.md in this directory')] }
};

export const Both: Story = {
  args: { issues: bothIssues.issues }
};

// Renders nothing rather than an empty box — the common case is a skill with no problems.
export const Empty: Story = {
  args: { issues: [] }
};
