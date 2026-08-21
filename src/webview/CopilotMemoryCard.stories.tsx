import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopilotMemoryCard } from './CopilotMemoryCard';

// One state only, and that's the finding rather than an omission: Copilot's memories live on
// GitHub, so there is nothing on this machine for the card to be full or empty of.
const meta: Meta<typeof CopilotMemoryCard> = {
  title: 'Memory/CopilotMemoryCard',
  component: CopilotMemoryCard,
  decorators: [
    (Story) => (
      <div className="w-[620px] p-3" style={{ ['--surface-accent' as string]: 'var(--vscode-charts-yellow, #cca700)' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof CopilotMemoryCard>;

export const Default: Story = {};
