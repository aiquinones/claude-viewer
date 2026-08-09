import type { Meta, StoryObj } from '@storybook/react-vite';
import { allSkills, snapshot } from '../fixtures';
import { LandingView } from './LandingView';

const meta: Meta<typeof LandingView> = {
  title: 'Landing/LandingView',
  component: LandingView,
  // onUnavailableSurface is a host round-trip in the real panel — a VS Code notification, which
  // Storybook has no way to show. Clicking the soon card here does nothing visible on purpose.
  args: {
    onOpenSurface: () => undefined,
    onUnavailableSurface: () => undefined,
    onRefresh: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof LandingView>;

export const Default: Story = {
  args: { snapshot: snapshot({ skills: allSkills }) }
};

// No folder open. The heading drops the workspace line and says which scopes still resolve.
export const NoWorkspace: Story = {
  args: {
    snapshot: {
      ...snapshot({ skills: allSkills.filter((skill) => skill.scope !== 'project') }),
      workspaceRoot: undefined
    }
  }
};

// Below `sm:` the cards stack. They keep the height they have two-across rather than growing with
// the panel — the 4:3 ratio would make each card as tall as the panel is wide.
export const NarrowPanel: Story = {
  args: { snapshot: snapshot({ skills: allSkills }) },
  globals: { viewport: { value: 'narrowPanel' } }
};

export const NoSkills: Story = {
  args: { snapshot: snapshot({ skills: [] }) }
};

// Deep paths are the common case, and the heading has to stay one line.
export const LongWorkspacePath: Story = {
  args: {
    snapshot: snapshot({
      skills: allSkills,
      workspaceRoot: '/Users/dev/repos/company/platform/services/api-gateway-experimental'
    })
  }
};
