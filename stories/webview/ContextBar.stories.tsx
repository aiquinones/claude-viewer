import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextReading, readContext } from '@src/model/sessions/context';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { ContextBar } from '@src/webview/ContextBar';

const meta: Meta<typeof ContextBar> = {
  title: 'Agents/ContextBar',
  component: ContextBar,
  decorators: [
    (Story) => (
      <div className="w-[420px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ContextBar>;

// The real resolver against the shipped defaults, so a change to a threshold or a window shows up
// in these stories rather than being restated here.
const reading = (args: { tokens: number; model: string }): ContextReading =>
  readContext({ context: args, settings: DEFAULT_SETTINGS.context });

// A tenth of a 1M window. Muted, not green — colour appears only where it means something.
export const Within: Story = {
  args: { reading: reading({ tokens: 103_900, model: 'claude-opus-5' }) }
};

// The story this feature exists for: a fifth of the bar, painted yellow. The fill says how much
// room is left and the colour says the conversation is long, and those are different questions.
// The first tick is where the colour changed.
export const NearOnALargeWindow: Story = {
  args: { reading: reading({ tokens: 214_000, model: 'claude-opus-5' }) }
};

// The same token count on a 200k model. Same colour, almost full bar — which is the window doing
// its job.
export const NearOnASmallWindow: Story = {
  args: { reading: reading({ tokens: 196_000, model: 'claude-sonnet-4-6' }) }
};

export const Over: Story = {
  args: { reading: reading({ tokens: 331_000, model: 'claude-opus-5' }) }
};

// Past the window assumed for the model. The fill clamps rather than running off the track; the
// card is where that gets explained.
export const PastTheWindow: Story = {
  args: { reading: reading({ tokens: 268_000, model: 'claude-sonnet-4-6' }) }
};

// A model the table doesn't know, so the window is the fallback — and both ticks land inside it.
export const UnknownModel: Story = {
  args: { reading: reading({ tokens: 61_000, model: 'claude-opus-6' }) }
};

// Thresholds turned off. No ticks, and the bar can only ever be muted.
export const NoThresholds: Story = {
  args: {
    reading: readContext({
      context: { tokens: 480_000, model: 'claude-opus-5' },
      settings: {
        ...DEFAULT_SETTINGS.context,
        warnAt: { value: 0, source: 'user' },
        errorAt: { value: 0, source: 'user' }
      }
    })
  }
};
