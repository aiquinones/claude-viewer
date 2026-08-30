import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  allPromptFiles,
  allSkills,
  brokenPromptFiles,
  userOnlyPromptFiles,
  snapshot
} from '../../fixtures';
import { SystemPromptView } from '@src/webview/views/SystemPromptView';

// The whole surface, off a plain snapshot. The view is h-full now that ViewSlider owns the height,
// so the stories supply their own.
const meta: Meta<typeof SystemPromptView> = {
  title: 'SystemPrompt/SystemPromptView',
  component: SystemPromptView,
  args: { onSearch: () => undefined, onRefresh: () => undefined, onBack: () => undefined },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SystemPromptView>;

export const Default: Story = {
  args: { snapshot: snapshot({ skills: allSkills, systemPrompt: allPromptFiles }) }
};

// No folder open: only ~/.claude/CLAUDE.md participates, and the header says so.
export const NoWorkspace: Story = {
  args: {
    snapshot: {
      ...snapshot({ skills: allSkills, systemPrompt: userOnlyPromptFiles }),
      workspaceRoot: undefined
    }
  }
};

// A legitimate answer, not an error — Claude starts here with no project instructions.
export const NoFiles: Story = {
  args: { snapshot: snapshot({ skills: allSkills, systemPrompt: [] }) }
};

// A missing import and a cycle. Neither stops the walk, and the headline total still adds up.
export const BrokenImports: Story = {
  args: { snapshot: snapshot({ skills: allSkills, systemPrompt: brokenPromptFiles }) }
};

// Selection is internal, so this story is the starting state — click a row to render its body
// below the list. The Storybook stub answers `requestBody` with a fixture, standing in for the host.
//
// Clicking also scrolls down to that body, which brings up the third header button: it takes you
// back to the row you left. Scroll up by hand and it goes away again.
export const ClickARowToRender: Story = {
  args: { snapshot: snapshot({ skills: allSkills, systemPrompt: allPromptFiles }) }
};

// The slowest read of a launch, since it walks the workspace looking for nested CLAUDE.md files —
// so this is the surface most likely to be opened before its loader is back.
export const StillReading: Story = {
  args: { snapshot: snapshot({ skills: [], systemPrompt: [], pending: ['systemPrompt'] }) }
};
