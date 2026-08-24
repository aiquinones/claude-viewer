import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { ContextSection } from '@src/webview/session-analysis/ContextSection';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { surfaceAccent } from '@src/webview/surfaces';
import { claudeDetail, copilotDetail, noContextDetail } from '../../session-detail-fixtures';

const meta: Meta<typeof ContextSection> = {
  title: 'Usage/ContextSection',
  component: ContextSection,
  args: { detail: claudeDetail },
  decorators: [
    (Story) => (
      <div
        className="w-[42rem] max-w-full p-4"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ContextSection>;

// The default thresholds, which this session never reaches — so the warn line sits above the curve
// and the error line isn't drawn at all. That the chart still shows the warn line is the point: a
// short session with no rules on it says nothing about how much room is left.
export const Session: Story = {};

// Thresholds low enough that the curve crosses both. The colour on the heading is the level the
// session ended at, which is the same reading the agent row's bar shows.
export const PastBothThresholds: Story = {
  decorators: [
    (Story) => (
      <SettingsProvider
        settings={{
          ...DEFAULT_SETTINGS,
          context: {
            ...DEFAULT_SETTINGS.context,
            warnAt: { value: 40_000, source: 'user' },
            errorAt: { value: 90_000, source: 'workspace' }
          }
        }}
      >
        <Story />
      </SettingsProvider>
    )
  ]
};

// Copilot's series is read out of its usage database rather than off its turns, so it's a different
// length from the requests beside it — and the chart gives no sign which file it came from.
export const Copilot: Story = { args: { detail: copilotDetail } };

// A session that ran and recorded nothing usable — a transcript with no finished assistant turn, or
// a machine whose usage database couldn't be read. An empty plot would be a claim that the context
// was empty, so it says so instead.
export const NoReadings: Story = { args: { detail: noContextDetail } };
