import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { AgentContext } from '@src/webview/AgentContext';
import {
  askingAgent,
  copilotWorkingAgent,
  noTranscriptAgent,
  overWindowAgent,
  unknownModelAgent,
  waitingAgent,
  workingAgent
} from '../agent-fixtures';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';

// The card opens below the bar, so every story needs room under it — otherwise the thing being
// looked at is the one part clipped away.
const meta: Meta<typeof AgentContext> = {
  title: 'Agents/AgentContext',
  component: AgentContext,
  decorators: [
    (Story) => (
      <div className="w-[380px] p-6 pb-64">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentContext>;

// Hover the bar. There's no (i) — the bar is the trigger.
export const Within: Story = { args: { agent: workingAgent } };

export const Near: Story = { args: { agent: waitingAgent } };

export const Over: Story = { args: { agent: askingAgent } };

// The window came from the fallback rather than the table, and the card says which.
export const UnknownModel: Story = { args: { agent: unknownModelAgent } };

// Bigger than its assumed window. The card carries the extra line, since the bar can only clamp.
export const PastTheWindow: Story = { args: { agent: overWindowAgent } };

// Thresholds you set rather than the shipped ones — the card names the layer, which is the whole
// reason the sources travel with the numbers.
export const YourOwnThresholds: Story = {
  args: { agent: waitingAgent },
  decorators: [
    (Story) => (
      <SettingsProvider
        settings={{
          ...DEFAULT_SETTINGS,
          context: {
            ...DEFAULT_SETTINGS.context,
            warnAt: { value: 150_000, source: 'user' },
            errorAt: { value: 250_000, source: 'workspace' }
          }
        }}
      >
        <Story />
      </SettingsProvider>
    )
  ]
};

// Copilot records no context size anywhere on disk, so the row has no bar at all. Renders nothing —
// an empty track would be a claim that the session is empty.
export const Copilot: Story = { args: { agent: copilotWorkingAgent } };

// A Claude session that hasn't finished an assistant turn. Also nothing.
export const NothingMeasuredYet: Story = { args: { agent: noTranscriptAgent } };
