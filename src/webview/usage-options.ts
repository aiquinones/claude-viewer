// What each toggle on the usage surface offers. Every one of them picks between two readings of the
// same sessions, so each option carries the sentence that says which — the labels are short enough
// to be ambiguous on their own.

import {
  UsageCostBasis,
  UsageMetric,
  UsageScope,
  UsageWindow,
  USAGE_WINDOWS
} from '../model/usage/types';
import { WINDOW_BLURB, WINDOW_LABEL } from '../model/usage/window';
import { ChoiceOption } from './menu/choice-option';

export const WINDOW_OPTIONS: readonly ChoiceOption<UsageWindow>[] = USAGE_WINDOWS.map((window) => ({
  id: window,
  label: WINDOW_LABEL[window],
  hint: WINDOW_BLURB[window]
}));

export const METRIC_OPTIONS: readonly ChoiceOption<UsageMetric>[] = [
  {
    id: 'output-tokens',
    label: 'Tokens',
    hint: 'Number of tokens used. Independent of model cost.'
  },
  {
    id: 'cost',
    label: 'Cost',
    hint: 'USD for Claude Code, AIU for Copilot CLI.'
  }
];

export const SCOPE_OPTIONS: readonly ChoiceOption<UsageScope>[] = [
  {
    id: 'all',
    label: 'All sessions',
    hint: 'Every session found on this machine.'
  },
  {
    id: 'workspace',
    label: 'This workspace',
    hint: 'Filtered to sessions working under the open folder. A worktree under it counts as this workspace.'
  }
];

// The two readings of what a Claude turn cost. `all` is the invoice; `output` is what the model
// wrote, which is also how Claude Code weights a skill's share of your usage — and it leaves out the
// context re-reads that make the full figure look wrong beside a token count.
export const COST_BASIS_OPTIONS: readonly ChoiceOption<UsageCostBasis>[] = [
  {
    id: 'all',
    label: 'Input + output',
    hint: 'What the API charges.'
  },
  {
    id: 'output',
    label: 'Output only',
    hint: 'Claude Code seems to only consider this.'
  }
];
