import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_SETTINGS, ViewerSettings } from '@src/model/settings/settings';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { TokenEstimate } from '@src/webview/TokenEstimate';

// Every "est. tokens" in the panel. The number and the card that says which approximation it is
// travel together, so both estimators are here side by side rather than one behind a setting.
const meta: Meta<typeof TokenEstimate> = {
  title: 'Shared/TokenEstimate',
  component: TokenEstimate,
  args: { chars: 8400 },
  // Room below for the card, which is what these stories are actually about.
  decorators: [
    (Story) => (
      <div className="p-6 pb-72 text-xs text-muted-foreground">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof TokenEstimate>;

// Hover is the pointer half; focus is the keyboard half of the same disclosure, and it's the one
// a story can drive.
const openCard = ({ canvasElement }: { canvasElement: HTMLElement }): void => {
  canvasElement.querySelector<HTMLElement>('button')?.focus();
};

// One estimator, as a provider. No provider at all reads the defaults, which is `Standard` below.
const withEstimator = (settings: ViewerSettings) => {
  const Decorator = (Story: () => JSX.Element) => (
    <SettingsProvider settings={settings}>
      <Story />
    </SettingsProvider>
  );
  return Decorator;
};

const anthropicSettings: ViewerSettings = {
  ...DEFAULT_SETTINGS,
  tokens: { estimator: { value: 'anthropic', source: 'user' } }
};

// The short form — a row that already says what it's counting.
export const Short: Story = {};

// The long form, for a heading or a header with room for it.
export const Long: Story = { args: { long: true } };

// What the card says with nothing configured: chars ÷ 4, and the way to change it.
export const StandardCard: Story = {
  args: { long: true },
  play: openCard
};

// The same number a third larger, and a card that says which multiplier did it.
export const AnthropicCard: Story = {
  args: { long: true },
  decorators: [withEstimator(anthropicSettings)],
  play: openCard
};

// A file small enough that the two estimators print different digits rather than the same rounded
// `k` — the case where the setting is visibly doing something.
export const SmallFile: Story = {
  args: { chars: 240, long: true },
  decorators: [withEstimator(anthropicSettings)]
};

// The card decides which way it opens from where its trigger sits, and a narrow panel is where
// that stops being theoretical.
export const NarrowPanel: Story = {
  args: { long: true },
  globals: { viewport: { value: 'narrowPanel' } },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-6 pb-72 text-xs text-muted-foreground">
        <Story />
      </div>
    )
  ],
  play: openCard
};
