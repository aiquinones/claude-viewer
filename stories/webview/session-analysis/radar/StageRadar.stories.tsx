import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { SessionDetail } from '@src/model/usage/types';
import { formatUsageTokens } from '@src/webview/usage-format';
import { StageRadar } from '@src/webview/session-analysis/radar/StageRadar';
import { EMPTY_STAGES, formatGrowth } from '@src/webview/session-analysis/radar/stage-labels';
import { SessionStage, toStages } from '@src/webview/session-analysis/stages';
import { surfaceAccent } from '@src/webview/surfaces';
import {
  bareDetail,
  claudeDetail,
  copilotDetail,
  twoStageDetail
} from '../../../session-detail-fixtures';

// Through the real rule rather than written out, so a story can't show a wheel the loader would
// never produce.
const stagesOf = (detail: SessionDetail, names: Record<string, string> = {}): SessionStage[] =>
  toStages({
    turns: detail.turns,
    invocations: detail.invocations,
    contexts: detail.contexts,
    metric: 'output-tokens',
    costBasis: 'all',
    names
  });

const meta: Meta<typeof StageRadar> = {
  title: 'Usage/StageRadar',
  component: StageRadar,
  args: {
    title: 'Output tokens per stage',
    stages: stagesOf(claudeDetail),
    read: (stage: SessionStage) => stage.value,
    format: formatUsageTokens,
    unit: 'output tokens',
    empty: EMPTY_STAGES
  },
  decorators: [
    (Story) => (
      <div className="p-4" style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof StageRadar>;

// Four stages, which is where a radar starts being worth drawing: the shape says which stretch of
// the session was the expensive one without anyone reading a number.
export const FourStages: Story = {};

// The same wheel plotting what each stage did to the context. A different number, the same shape of
// answer — which is why the component never learns which of the two it is.
export const ContextGrowth: Story = {
  args: {
    title: 'Context growth',
    read: (stage: SessionStage) => stage.growth,
    format: formatGrowth,
    unit: 'context'
  }
};

// Two vertices are a line, so there's no area to close — the spokes and the dots carry it. Worth a
// story because it's the case a polygon would draw a lie about.
export const TwoStages: Story = { args: { stages: stagesOf(twoStageDetail) } };

// Copilot's double load of one skill is one stage, not two, so its wheel has a single spoke. The
// rings become circles here: a polygon through one point is nothing.
export const OneStage: Story = { args: { stages: stagesOf(copilotDetail) } };

// No skills were loaded, so nothing split the session. Not an error — an empty wheel would be a
// claim that every stage cost zero.
export const NoStages: Story = { args: { stages: stagesOf(bareDetail) } };

// A renamed stage. The spoke carries the reader's own word for it; the skill behind it is in the
// hover, since that's what the override is keyed on.
export const Renamed: Story = {
  args: {
    stages: stagesOf(claudeDetail, {
      'dev-feature': 'Build',
      'create-pr': 'Ship',
      publish: 'Release'
    })
  }
};

// A name long enough to reach the next spoke's. It truncates rather than overlapping — a wheel
// whose labels collide is unreadable in a way a cut word isn't.
export const LongName: Story = {
  args: {
    stages: stagesOf(claudeDetail, { 'dev-feature': 'The whole feature development cycle' })
  }
};
