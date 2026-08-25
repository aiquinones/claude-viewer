import type { Meta, StoryObj } from '@storybook/react-vite';
import { UnsplitStages } from '@src/webview/session-analysis/radar/UnsplitStages';

const meta: Meta<typeof UnsplitStages> = {
  title: 'Usage/UnsplitStages',
  component: UnsplitStages,
  args: { onAssignNames: () => undefined },
  decorators: [
    (Story) => (
      <div className="w-[42rem] max-w-full p-4">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof UnsplitStages>;

// What a session shows before anyone has named a stage. The button is the whole reason this is a
// card rather than a sentence — the state is a question, and this is where it gets answered.
export const Unsplit: Story = {};

// Narrow enough that the sentence wraps and the button holds its line. It's the panel width the
// wheels stack at, which is where this card is seen just as often.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-[19rem]">
        <Story />
      </div>
    )
  ]
};
