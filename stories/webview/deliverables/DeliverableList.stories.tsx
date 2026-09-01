import type { Meta, StoryObj } from '@storybook/react-vite';
import { DELIVERABLE_KINDS, Deliverable } from '@src/model/types';
import { DeliverableList } from '@src/webview/deliverables/DeliverableList';
import { deliverables } from '../../agent-fixtures';

// What a session announced it produced. A `url` chip is an `<a>` and a `path` chip is a `<button>`,
// which is only visible in what they do — they're drawn as one thing.
const meta: Meta<typeof DeliverableList> = {
  title: 'Agents/DeliverableList',
  component: DeliverableList,
  args: { onOpen: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof DeliverableList>;

export const Mixed: Story = { args: { deliverables } };

// Every kind at once, which is the only place the four icons can be compared. `pr` is here as a
// declared deliverable — the auto-detected one is a link of its own on the row above.
export const EveryKind: Story = {
  args: {
    deliverables: DELIVERABLE_KINDS.map(
      (kind): Deliverable => ({ kind, title: kind, url: `https://example.com/${kind}` })
    )
  }
};

// A single chip, which is what most sessions that declare anything will have.
export const One: Story = { args: { deliverables: [deliverables[0]] } };

// Past the row's width, so the list wraps rather than pushing the row sideways.
export const Wrapping: Story = {
  args: {
    deliverables: [
      ...deliverables,
      { kind: 'link', title: 'Coverage report', url: 'https://example.com/coverage' },
      { kind: 'file', title: 'Migration notes', path: '/Users/dev/repos/example-app/docs/notes.md' }
    ]
  }
};

// The cap the chip truncates against. Nothing bounds what an agent writes here.
export const LongTitle: Story = {
  args: {
    deliverables: [
      {
        kind: 'link',
        title: 'The staging deployment of the settings pane, rebuilt from this branch',
        url: 'https://staging.example.com/settings'
      }
    ]
  }
};

// Nothing declared. The list draws an empty row rather than deciding — `AgentRowFooter` is what
// keeps it off a row that has none.
export const Empty: Story = { args: { deliverables: [] } };
