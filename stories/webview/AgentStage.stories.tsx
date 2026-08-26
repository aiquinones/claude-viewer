import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactElement, ReactNode } from 'react';
import { DEFAULT_SETTINGS } from '@src/model/settings/settings';
import { AgentStage } from '@src/webview/AgentStage';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { idleAgent, longTitleAgent, workingAgent } from '../agent-fixtures';
import { stageNames } from '../session-detail-fixtures';

// The stored names are the whole state this reads: a skill in the map opens a stage, one out of it
// is a skill the row steps over. So every story here is really a story about that map.
const withNames =
  (names: Record<string, string>) =>
  (Story: () => ReactNode): ReactElement => (
    <SettingsProvider settings={{ ...DEFAULT_SETTINGS, stages: { names } }}>
      <Story />
    </SettingsProvider>
  );

const meta: Meta<typeof AgentStage> = {
  title: 'Agents/AgentStage',
  component: AgentStage,
  args: { agent: workingAgent, activity: 'running' },
  decorators: [
    withNames(stageNames),
    (Story) => (
      <div className="flex w-64 justify-end p-4">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentStage>;

// The shimmer. It's a highlight sweeping the letters rather than the label fading, so the word
// stays readable the whole time — worth watching for a few seconds rather than screenshotting.
export const Working: Story = {};

// Same label, no sweep. The stage a session ended in is a fact, and a second thing animating on
// every row of a list you leave open is noise.
export const Idle: Story = { args: { agent: idleAgent, activity: 'idle' } };

// A row waiting on you still counts as going, so it shimmers — "idle" is the only state that
// stops it.
export const Blocked: Story = { args: { activity: 'blocked' } };

// The current skill has no name, and nothing before it does either, so there is no stage at all.
// The default state until someone names something.
export const NoStage: Story = { args: { agent: longTitleAgent } };

// The reader named it, so it can be a sentence. Capped and clipped rather than allowed to push the
// age off the row — the hover says the whole thing.
export const LongLabel: Story = {
  decorators: [withNames({ 'dev-feature': 'Building the retry budget and its tests' })]
};

// A name in the map that this session never loaded changes nothing: the trail is what's read, and
// the map only says which of those count.
export const UnrelatedName: Story = {
  decorators: [withNames({ publish: 'Release' })]
};
