import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodexMemoryCard } from '@src/webview/CodexMemoryCard';

// One state, like the Copilot card — but for the opposite reason. Copilot's memories aren't on this
// machine at all; Codex's are, and this panel doesn't read them yet. The card exists so the tab says
// which of those two it is.
const meta: Meta<typeof CodexMemoryCard> = {
  title: 'Memory/CodexMemoryCard',
  component: CodexMemoryCard,
  decorators: [
    (Story) => (
      <div
        className="w-[620px] p-3"
        style={{ ['--surface-accent' as string]: 'var(--vscode-charts-yellow, #cca700)' }}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof CodexMemoryCard>;

export const Default: Story = {};
