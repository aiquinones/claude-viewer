import type { Meta, StoryObj } from '@storybook/react-vite';
import { allSkills, snapshot } from '../fixtures';
import { brokenMemorySet, emptyMemorySet, memorySet } from '../memory-fixtures';
import { MemoryView } from './MemoryView';

// The whole surface, off a plain snapshot. The view is h-full now that ViewSlider owns the height,
// so the stories supply their own.
const meta: Meta<typeof MemoryView> = {
  title: 'Memory/MemoryView',
  component: MemoryView,
  args: {
    onOpenFile: () => undefined,
    onSearch: () => undefined,
    onRefresh: () => undefined,
    onBack: () => undefined
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

type Story = StoryObj<typeof MemoryView>;

export const Default: Story = {
  args: { snapshot: snapshot({ skills: allSkills, memory: memorySet }) }
};

// Both failure modes at once: a memory with no index line, and an index line with no memory.
export const BrokenIndex: Story = {
  args: { snapshot: snapshot({ skills: allSkills, memory: brokenMemorySet }) }
};

// A directory that exists and holds nothing. The empty state names the directory, because a
// worktree has its own and "nothing here" is a claim about one path.
export const NoMemories: Story = {
  args: { snapshot: snapshot({ skills: allSkills, memory: emptyMemorySet }) }
};

// No folder open: memory is keyed on the working directory, so there is nowhere to look — and no
// user scope to fall back to, unlike every other surface.
export const NoWorkspace: Story = {
  args: {
    snapshot: {
      ...snapshot({ skills: allSkills, memory: null }),
      workspaceRoot: undefined
    }
  }
};

// Selection is internal, so this story is the starting state — click a row to render its text
// below the list. The Storybook stub answers `requestBody` with a fixture, standing in for the host.
export const ClickARowToRender: Story = {
  args: { snapshot: snapshot({ skills: allSkills, memory: memorySet }) }
};
