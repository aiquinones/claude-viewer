// What each toggle on the usage surface offers. Every one of them picks between two readings of the
// same sessions, so each option carries the sentence that says which — the labels are short enough
// to be ambiguous on their own.

import { UsageMetric, UsageScope, UsageWindow, USAGE_WINDOWS } from '../model/usage/types';
import { WINDOW_BLURB, WINDOW_LABEL } from '../model/usage/window';
import { ChoiceOption } from './UsageChoice';

export const WINDOW_OPTIONS: readonly ChoiceOption<UsageWindow>[] = USAGE_WINDOWS.map((window) => ({
  id: window,
  label: WINDOW_LABEL[window],
  hint: WINDOW_BLURB[window]
}));

export const METRIC_OPTIONS: readonly ChoiceOption<UsageMetric>[] = [
  {
    id: 'output-tokens',
    label: 'Tokens',
    hint: 'Output tokens — measured by both CLIs, and the number Claude Code’s own /usage reports.'
  },
  {
    id: 'cost',
    label: 'Cost',
    hint: 'Dollars for Claude Code, priced from a table; AIU for Copilot CLI, which records its own billed figure.'
  }
];

export const SCOPE_OPTIONS: readonly ChoiceOption<UsageScope>[] = [
  {
    id: 'all',
    label: 'All sessions',
    hint: 'Every session on this machine — what usage limits are counted against.'
  },
  {
    id: 'workspace',
    label: 'This workspace',
    hint: 'Only sessions working under the open folder. A worktree under it counts as this workspace.'
  }
];
