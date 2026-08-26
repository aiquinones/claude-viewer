import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { AgentContext } from '@src/webview/AgentContext';
import {
  askingAgent,
  copilotBlockedAgent,
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
export const Within: Story = { args: { context: workingAgent.context } };

export const Near: Story = { args: { context: waitingAgent.context } };

export const Over: Story = { args: { context: askingAgent.context } };

// The window came from the fallback rather than the table, and the card says which.
export const UnknownModel: Story = { args: { context: unknownModelAgent.context } };

// Bigger than its assumed window. The card carries the extra line, since the bar can only clamp.
export const PastTheWindow: Story = { args: { context: overWindowAgent.context } };

// Thresholds you set rather than the shipped ones — the card names the layer, which is the whole
// reason the sources travel with the numbers.
export const YourOwnThresholds: Story = {
  args: { context: waitingAgent.context },
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

// A Copilot row, which reads identically to a Claude one — the two CLIs record the number in
// different places and different arithmetic, and none of that should reach the card.
export const Copilot: Story = { args: { context: copilotWorkingAgent.context } };

// Copilot spells this model `claude-haiku-4.5` where Claude Code writes `claude-haiku-4-5`. Both
// reach the same 200k row, so the card names a window rather than falling back.
export const CopilotDottedModelId: Story = { args: { context: copilotBlockedAgent.context } };

// A session that hasn't finished an assistant turn — and, for Copilot, one whose usage database
// couldn't be opened. Renders nothing: an empty track would be a claim that the session is empty.
export const NothingMeasuredYet: Story = { args: { context: noTranscriptAgent.context } };
