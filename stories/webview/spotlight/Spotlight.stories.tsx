import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spotlight } from '@src/webview/spotlight/Spotlight';
import { searchDocs } from '../../fixtures';

const meta: Meta<typeof Spotlight> = {
  title: 'Spotlight/Spotlight',
  component: Spotlight,
  args: { index: searchDocs, onChoose: () => undefined, onDismiss: () => undefined },
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof Spotlight>;

// How it opens from the landing page: no filter, no rows. The hint line is the only thing that
// says `filter:` exists.
export const Empty: Story = {
  args: {}
};

// `dep` matches all three copies of `deploy` — the winner first, the shadowed ones dimmed under it.
export const WithResults: Story = {
  args: { initialQuery: 'dep' }
};

// A subsequence, not a substring: `mo` reaches `math-olympiad` through two separate words.
export const Subsequence: Story = {
  args: { initialQuery: 'mo' }
};

// More matches than SEARCH_LIMIT, so the list is capped at the best five.
export const Capped: Story = {
  args: { initialQuery: 'e' }
};

export const NoMatch: Story = {
  args: { initialQuery: 'zzz' }
};

// The panel's own surfaces are in the index too, so the box is also how you reach one. `us` puts
// Usage on top with config under it — mixed kinds in one list, which is what the tag on the right
// is for.
export const ViewResults: Story = {
  args: { initialQuery: 'us' }
};

// Opened from inside the skills surface, so it starts narrowed before you type a character. One
// pill — being on a surface doesn't mean you're looking for a surface.
export const FilteredToSkills: Story = {
  args: { initialFilters: ['skill'], initialQuery: 'dep' }
};

// Narrowed to the surfaces alone — Active Agents and Usage are the two with an `a` in them.
export const FilteredToViews: Story = {
  args: { initialFilters: ['view'], initialQuery: 'a' }
};

// A filter with an empty box. The hint line names whichever kind isn't on yet.
export const FilterOnlyNoQuery: Story = {
  args: { initialFilters: ['skill'] }
};
