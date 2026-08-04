import type { Meta, StoryObj } from '@storybook/react-vite';
import { allSkills, plainSkill, pluginDeploy, reveal, snapshot } from '../fixtures';
import { SkillView } from './SkillView';

// SkillView takes a plain snapshot and its callbacks. The one thing it fetches for itself is the
// selected skill's body, which .storybook/preview.tsx answers with a fixture.
// These are the stories to reach for when changing the skills surface.
//
// The view is h-full now that ViewSlider owns the height, so stories supply their own.
const meta: Meta<typeof SkillView> = {
  title: 'Skills/SkillView',
  component: SkillView,
  args: { onOpenFile: () => undefined, onRefresh: () => undefined, onBack: () => undefined },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillView>;

export const Default: Story = {
  args: { snapshot: snapshot({ skills: allSkills }) }
};

// No folder open: project scope is absent and the header says so rather than showing zero.
export const NoWorkspace: Story = {
  args: {
    snapshot: {
      ...snapshot({ skills: allSkills.filter((skill) => skill.scope !== 'project') }),
      workspaceRoot: undefined
    }
  }
};

export const NoSkills: Story = {
  args: { snapshot: snapshot({ skills: [] }) }
};

// One skill, no collisions — the header drops its shadowed count.
export const SingleSkill: Story = {
  args: { snapshot: snapshot({ skills: [plainSkill] }) }
};

// Nothing of your own — everything came from an installed plugin.
export const OnlyPluginSkills: Story = {
  args: {
    snapshot: snapshot({ skills: allSkills.filter((skill) => skill.scope === 'plugin') })
  }
};

// Arriving from `vscode://canoq.claude-viewer/skill/deploy?scope=plugin`. Selection overrides the
// default first-row pick, and it lands on a shadowed skill, so the detail names the winner.
export const RevealedShadowedSkill: Story = {
  args: {
    snapshot: snapshot({ skills: allSkills }),
    reveal: reveal(pluginDeploy)
  }
};
