import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CollapsibleHeading } from './CollapsibleHeading';
import { TokenEstimate } from './TokenEstimate';

// The heading four grouped lists share. Every caller's shape is here, so a change to the row can
// be read against all of them at once rather than by opening four surfaces.
const meta: Meta<typeof CollapsibleHeading> = {
  title: 'Shared/CollapsibleHeading',
  component: CollapsibleHeading,
  args: { onToggle: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-80 p-2">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof CollapsibleHeading>;

// Open, with the note carrying a count — how AgentList draws a group.
export const Expanded: Story = {
  args: { title: 'This workspace', note: '4 agents', collapsed: false }
};

// Folded. The note is the half that has to survive, since the rows it describes are gone.
export const Collapsed: Story = {
  args: { title: 'This workspace', note: '4 agents', collapsed: true }
};

// A subtotal rather than a count — the system prompt's sections, where the note is the whole point
// of reading a folded heading.
export const WithSubtotal: Story = {
  args: {
    title: 'Always loads',
    note: '5 files · ~2.1k est. tokens',
    collapsed: true
  }
};

// SkillList keeps its count bold and only the tokens normal-case, so the count rides in the title.
// It's also the only caller that wants a tooltip.
export const SplitAcrossBoth: Story = {
  args: {
    title: 'Plugin · 24',
    note: '~1.8k',
    tooltip: 'Plugin skills · what their descriptions cost in the system prompt',
    collapsed: false
  }
};

// The reason the note is a node and sits outside the toggle: a token estimate opens a card with a
// button in it, and a `<button>` can't legally hold one. Hovering the number here is the check that
// it opens over the heading rather than inside it.
export const NoteWithEstimate: Story = {
  args: {
    title: 'Always loads',
    note: (
      <>
        5 files · <TokenEstimate chars={8400} long />
      </>
    ),
    collapsed: false
  }
};

// No note at all, which is the tracking view — a label and a count and nothing to total.
export const NoNote: Story = {
  args: { title: 'Ideas · 7', collapsed: false }
};

// The chevron actually turning. The args stories are static by design; this one is the click.
export const Interactive: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    return (
      <CollapsibleHeading
        title="Elsewhere"
        note="2 agents"
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
      />
    );
  }
};
