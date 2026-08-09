import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillNav } from './SkillNav';
import { allSkills, projectDeploy } from './fixtures';

// The decorator is SkillView's grid, because that's what the nav's positioning resolves against:
// `relative` for the parked panel, `overflow-x-clip` so parking it doesn't add scrollable width.
//
// The rail stories are set to the narrow viewport — the wide one keeps both columns and there's no
// rail to look at. Hover the left edge to bring the list back; Tab into it does the same.
const meta: Meta<typeof SkillNav> = {
  title: 'Skills/SkillNav',
  component: SkillNav,
  args: { skills: allSkills, selectedPath: projectDeploy.path, onSelect: () => undefined },
  decorators: [
    (Story) => (
      <div className="relative grid h-screen grid-cols-[minmax(0,1fr)] overflow-x-clip md:grid-cols-[minmax(160px,240px)_minmax(0,1fr)]">
        <Story />
        <div className="p-5 text-sm text-muted-foreground">
          The detail pane. Under 768px it has the whole width and the list slides over it.
        </div>
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillNav>;

// 768px and up: an ordinary grid column, 160–240px, and no rail at all.
export const Pinned: Story = {
  globals: { viewport: { value: 'widePanel' } }
};

// Just the border, carried by a 10px hover strip. Nothing new drawn.
export const RailLine: Story = {
  args: { rail: 'line' },
  globals: { viewport: { value: 'narrowPanel' } }
};

// The same strip with a mark centred on it, so there's something to aim at.
export const RailGrip: Story = {
  args: { rail: 'grip' },
  globals: { viewport: { value: 'narrowPanel' } }
};

// A button instead: hover to peek, click to pin it open, click again to let it go.
export const RailChevron: Story = {
  args: { rail: 'chevron' },
  globals: { viewport: { value: 'narrowPanel' } }
};

// One scope, few rows — the panel is short but still full height, so the rail is unchanged.
export const RailChevronFewSkills: Story = {
  args: {
    rail: 'chevron',
    skills: allSkills.filter((skill) => skill.scope === 'project'),
    selectedPath: projectDeploy.path
  },
  globals: { viewport: { value: 'narrowPanel' } }
};
