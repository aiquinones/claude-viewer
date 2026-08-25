import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, ReactElement, ReactNode } from 'react';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { StageRadars } from '@src/webview/session-analysis/radar/StageRadars';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { surfaceAccent } from '@src/webview/surfaces';
import {
  bareDetail,
  claudeDetail,
  copilotDetail,
  stageNames
} from '../../../session-detail-fixtures';

// The stored names are the whole state this section reads: a skill in the map is a stage, and one
// out of it is a skill the split ignores. So every story here is really a story about this map.
const withNames =
  (names: Record<string, string>) =>
  (Story: () => ReactNode): ReactElement => (
    <SettingsProvider settings={{ ...DEFAULT_SETTINGS, stages: { names } }}>
      <Story />
    </SettingsProvider>
  );

const meta: Meta<typeof StageRadars> = {
  title: 'Usage/StageRadars',
  component: StageRadars,
  args: { detail: claudeDetail, metric: 'output-tokens' },
  decorators: [
    withNames(stageNames),
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

// Skills ran and none of them is a stage yet, which is where every session starts. The card takes
// the wheels' place and carries the way out of the state — two empty wheels would say the session
// can't be split, when the truth is that nobody has split it.
export const Unsplit: Story = { decorators: [withNames({})] };

// One skill named out of the four. The other three open no stage, so the one that does covers the
// whole session — the ignore half of the feature, seen on the wheel.
export const SomeIgnored: Story = { decorators: [withNames({ 'dev-feature': 'Build' })] };

// No skills at all, so there is nothing to name and no card offering it. The (i) is still there —
// how a session gets split is the question a reader has here most of all.
export const NoSkills: Story = { args: { detail: bareDetail } };

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
