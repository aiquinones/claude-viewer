import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillNav } from './SkillNav';
import { allSkills, plainSkill, projectDeploy } from './fixtures';

// The decorator is SkillView's grid, because that's what the nav's positioning resolves against:
// `relative` for the parked panel, `overflow-x-clip` so parking it doesn't add scrollable width.
//
// The collapsed stories are set to the narrow viewport — the wide one keeps both columns and there
// is no rail to look at. Hover the handle on the left edge to bring the list back; Tab does the
// same. The detail pane here is a stand-in; SkillView's own stories have the real one.
const meta: Meta<typeof SkillNav> = {
  title: 'Skills/SkillNav',
  component: SkillNav,
  args: { skills: allSkills, selectedPath: projectDeploy.path, onSelect: () => undefined },
  decorators: [
    (Story) => (
      <div className="relative grid h-screen grid-cols-[minmax(0,1fr)] overflow-x-clip md:grid-cols-[minmax(160px,240px)_minmax(0,1fr)]">
        <Story />
        <div className="relative z-0 p-5 pl-4 text-sm text-muted-foreground md:pl-2">
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

// Under 768px: parked off the left edge, with the handle as the way back in.
export const Collapsed: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};

// A short list still gets a full-height rail — the handle stays where the eye expects it.
export const CollapsedFewSkills: Story = {
  args: { skills: [plainSkill], selectedPath: plainSkill.path },
  globals: { viewport: { value: 'narrowPanel' } }
};
