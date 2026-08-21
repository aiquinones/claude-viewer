import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TOKEN_ESTIMATORS, TokenEstimator } from '../model/estimate-tokens';
import { EstimatorFormula } from './EstimatorFormula';

// The drawing under the dialog's radios. Static in the arg stories; the shift between them is what
// `Switching` is for, since it's the only thing here that can't be read from a still.
const meta: Meta<typeof EstimatorFormula> = {
  title: 'Settings/EstimatorFormula',
  component: EstimatorFormula,
  decorators: [
    (Story) => (
      <div className="w-md p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof EstimatorFormula>;

// The fraction alone, centred — chars over 4.
export const Standard: Story = { args: { estimator: 'standard' } };

// Shifted left, with the multiplier beside it.
export const Anthropic: Story = { args: { estimator: 'anthropic' } };

// The transition. `translate` and `opacity` are separate properties on purpose — one row that grows
// can't be animated, since `width: auto` doesn't interpolate.
export const Switching: Story = {
  render: () => {
    const [estimator, setEstimator] = useState<TokenEstimator>('standard');

    return (
      <div className="flex flex-col gap-3">
        <EstimatorFormula estimator={estimator} />
        <div className="flex gap-2">
          {TOKEN_ESTIMATORS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setEstimator(option)}
              className={`cursor-pointer rounded-md border border-border px-2 py-1 text-xs ${
                option === estimator ? 'bg-accent text-foreground' : 'text-muted-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }
};
