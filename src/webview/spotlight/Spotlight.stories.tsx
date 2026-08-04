import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spotlight } from './Spotlight';
import { searchDocs } from '../fixtures';

const meta: Meta<typeof Spotlight> = {
  title: 'Spotlight/Spotlight',
  component: Spotlight,
  args: { index: searchDocs, onChoose: () => undefined, onDismiss: () => undefined },
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof Spotlight>;

// How it opens: no rows at all. Type to search, arrow down into the results, Enter to open one.
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
