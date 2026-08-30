import type { Meta, StoryObj } from '@storybook/react-vite';
import { allAgents } from '../../agent-fixtures';
import { allSkills, snapshot, userOnlyPromptFiles } from '../../fixtures';
import { LandingView } from '@src/webview/views/LandingView';

const meta: Meta<typeof LandingView> = {
  title: 'Landing/LandingView',
  component: LandingView,
  // onUnavailableSurface is a host round-trip in the real panel — a VS Code notification, which
  // Storybook has no way to show. Clicking the soon card here does nothing visible on purpose.
  args: {
    agents: allAgents,
    onOpenSurface: () => undefined,
    onUnavailableSurface: () => undefined,
    onSearch: () => undefined,
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

// Three cards, one of them dimmed: Active Agents counts real sessions while its surface is `soon`,
// so the card says what's behind it before it opens.
export const Default: Story = {
  args: { snapshot: snapshot({ skills: allSkills }) }
};

// No folder open. The heading drops the workspace line and says which scopes still resolve.
export const NoWorkspace: Story = {
  args: {
    snapshot: {
      ...snapshot({
        skills: allSkills.filter((skill) => skill.scope !== 'project'),
        systemPrompt: userOnlyPromptFiles
      }),
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

// Every card with nothing behind it — the counts are the only thing that changes.
export const NothingConfigured: Story = {
  args: { agents: [], snapshot: snapshot({ skills: [], systemPrompt: [] }) }
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

// A cold launch, one frame in: the page is drawn and its three config cards are still reading. The
// usage card has always looked like this — the other three are new.
export const StillReading: Story = {
  args: {
    agents: [],
    usage: undefined,
    snapshot: snapshot({
      skills: [],
      systemPrompt: [],
      memory: null,
      pending: ['skills', 'systemPrompt', 'memory']
    })
  }
};
