import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { UsageMetric } from '@src/model/usage/types';
import { ChoiceOption, UsageChoice } from '@src/webview/UsageChoice';

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
