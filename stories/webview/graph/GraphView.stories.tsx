import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { plainSkill, projectDeploy, skillGraph } from '../../fixtures';
import { surfaceAccent } from '@src/webview/surfaces';
import { GraphView } from '@src/webview/graph/GraphView';

// The accent is set by SkillView in the panel; a story has to set it itself or every state below
// falls back to plain foreground.
const meta: Meta<typeof GraphView> = {
  title: 'Skills/GraphView',
  component: GraphView,
  args: { graph: skillGraph, viewedPath: projectDeploy.path },
  decorators: [
    (Story) => (
      <div className="p-5" style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof GraphView>;

export const Default: Story = {};

// The viewed skill is a leaf rather than the hub, which is the more common case.
export const ViewingALeaf: Story = { args: { viewedPath: plainSkill.path } };

// Nothing selected — the neighbourhood filter has no centre, so the whole graph draws. Only a
// story gets here; the panel always has a skill selected.
export const NothingViewed: Story = { args: { viewedPath: undefined } };
