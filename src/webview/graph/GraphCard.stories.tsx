import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillGraphNode } from '../../model/types';
import { longDescription, noDescription, projectDeploy } from '../fixtures';
import { GraphCard } from './GraphCard';

const toNode = (skill: typeof projectDeploy): SkillGraphNode => ({
  path: skill.path,
  name: skill.name,
  description: skill.description,
  scope: skill.scope,
  pluginName: skill.pluginName
});

const meta: Meta<typeof GraphCard> = {
  title: 'Skills/GraphCard',
  component: GraphCard,
  args: { node: toNode(projectDeploy) },
  decorators: [
    (Story) => (
      // The card positions itself against a node; a story stands in for one.
      <div className="relative h-72 w-full">
        <div className="absolute left-1/2 top-10">
          <Story />
        </div>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof GraphCard>;

export const Default: Story = {};

// A plugin skill, where the badge carries the plugin's name instead of the scope.
export const FromAPlugin: Story = { args: { node: toNode(longDescription) } };

// Nothing to read: the card says so rather than leaving a gap under the name.
export const NoDescription: Story = { args: { node: toNode(noDescription) } };
