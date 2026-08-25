import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { StageRadars } from '@src/webview/session-analysis/radar/StageRadars';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { surfaceAccent } from '@src/webview/surfaces';
import { bareDetail, claudeDetail, copilotDetail } from '../../../session-detail-fixtures';

const meta: Meta<typeof StageRadars> = {
  title: 'Usage/StageRadars',
  component: StageRadars,
  args: { detail: claudeDetail, metric: 'output-tokens', costBasis: 'all' },
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

type Story = StoryObj<typeof StageRadars>;

// Both wheels side by side, which is the shape the section is for: what a stage spent and what it
// did to the context are two readings of one split, and reading them together is the point.
export const Session: Story = {};

// Cost rather than output tokens, which the `...` above this section switches. The heading names
// the metric, so the two wheels can't end up in different units.
export const Cost: Story = { args: { metric: 'cost' } };

// A Copilot session: one skill, loaded twice, one stage. AIU rather than dollars, which the CLI
// decides and not the reader.
export const Copilot: Story = { args: { detail: copilotDetail, metric: 'cost' } };

// No skills, so no stages. Both wheels say so rather than drawing an empty grid, and the (i) is
// still there — how the splits are made is the question a reader has here most of all.
export const NoStages: Story = { args: { detail: bareDetail } };

// Names already stored. Reopening the dialog from the (i) shows these back, which is what makes an
// override something you can edit rather than only set.
export const Renamed: Story = {
  decorators: [
    (Story) => (
      <SettingsProvider
        settings={{
          ...DEFAULT_SETTINGS,
          stages: { names: { 'dev-feature': 'Build', 'create-pr': 'Ship' } }
        }}
      >
        <Story />
      </SettingsProvider>
    )
  ]
};

// The panel narrow enough that the two wheels stack. It's `flex-wrap` rather than a breakpoint — a
// media query in the webview measures the panel, and wrapping needs no number to be right about.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-[19rem]">
        <Story />
      </div>
    )
  ]
};
