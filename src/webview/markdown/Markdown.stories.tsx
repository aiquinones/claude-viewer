import type { Meta, StoryObj } from '@storybook/react-vite';
import { headinglessMarkdown, skillMarkdown, skippedLevelMarkdown } from '../fixtures';
import { Markdown } from './Markdown';

// The decorator is doing real work: sticky resolves against the nearest scrolling ancestor, so
// without a fixed height and an overflow here the headings have nothing to pin to and every story
// looks the same. `px-5` is the padding the heading bars reach back through.
const meta: Meta<typeof Markdown> = {
  title: 'Markdown/Markdown',
  component: Markdown,
  decorators: [
    (Story) => (
      <div className="h-screen overflow-y-auto overflow-x-clip px-5 py-4">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Markdown>;

// Scroll this one. `#` pins at the top, `##` under it, `###` under that, and each releases when
// its own section ends rather than hanging around into the next.
export const Default: Story = { args: { raw: skillMarkdown } };

// Nothing to pin — the blocks render in a section with no bar.
export const NoHeadings: Story = { args: { raw: headinglessMarkdown } };

// `#` straight to `###`. The `###` stacks one row down, not three, because depth is position in
// the tree and not the number of hashes.
export const SkippedLevel: Story = { args: { raw: skippedLevelMarkdown } };

// A vscode:// link that named `## Rollback`. The section scrolls itself into view on mount and the
// bar stays lit — the highlight is a selection, not a notification, so it clears on the next click
// rather than on a timer.
export const LinkedSection: Story = {
  args: { raw: skillMarkdown, target: { slug: 'rollback', nonce: 1 } }
};

// A heading two levels down. The scroll has to stop below the bar its parent pins to, which is what
// the section's `scroll-margin-top` is for — landing flush with the pane's top would put it behind.
export const LinkedSubSection: Story = {
  args: { raw: skillMarkdown, target: { slug: 'after-a-rollback', nonce: 1 } }
};

export const Empty: Story = { args: { raw: '' } };
