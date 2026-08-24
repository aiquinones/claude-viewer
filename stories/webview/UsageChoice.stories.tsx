import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { UsageMetric } from '@src/model/usage/types';
import { UsageChoice } from '@src/webview/UsageChoice';
import { ChoiceOption } from '@src/webview/menu/choice-option';

const METRICS: readonly ChoiceOption<UsageMetric>[] = [
  {
    id: 'output-tokens',
    label: 'Tokens',
    hint: 'Output tokens — measured by both CLIs.'
  },
  {
    id: 'cost',
    label: 'Cost',
    hint: 'Dollars for Claude Code, AIU for Copilot CLI.'
  }
];

const meta: Meta<typeof UsageChoice> = {
  title: 'Usage/UsageChoice',
  component: UsageChoice
};

export default meta;

type Story = StoryObj<typeof UsageChoice>;

// Live, because what this component is is the moving selection — a static one says nothing about
// whether picking the other option reads as a change.
export const Metric: Story = {
  render: () => {
    const [value, setValue] = useState<UsageMetric>('output-tokens');
    return <UsageChoice label="Metric" options={METRICS} value={value} onChange={setValue} />;
  }
};

// A hint carrying paths and a setting name. Backticked runs come through in the editor's mono face
// and wrap inside the card, which is what keeps a long path from deciding how wide the card is.
export const TickedHints: Story = {
  render: () => {
    const [value, setValue] = useState<string>('claude');
    return (
      <UsageChoice
        label="CLI"
        options={[
          {
            id: 'claude',
            label: 'Claude Code',
            hint: 'Sessions under `~/.claude/projects`. The window comes from `cleanupPeriodDays`.'
          },
          {
            id: 'copilot',
            label: 'Copilot CLI',
            hint: 'Sessions under `~/.copilot/session-state`. No documented retention period, so the window is whatever was found.'
          }
        ]}
        value={value}
        onChange={setValue}
      />
    );
  }
};

// Words of very different lengths, which is why the selected option is painted rather than chased
// by a sliding tile the way ViewModeToggle does it.
export const UnevenLabels: Story = {
  render: () => {
    const [value, setValue] = useState<string>('all');
    return (
      <UsageChoice
        label="Sessions"
        options={[
          {
            id: 'all',
            label: 'All sessions',
            hint: 'Every session on this machine.'
          },
          {
            id: 'workspace',
            label: 'This workspace',
            hint: 'Only sessions under the open folder.'
          }
        ]}
        value={value}
        onChange={setValue}
      />
    );
  }
};
