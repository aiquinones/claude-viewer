// What each toggle on the usage surface offers. Both pick between two readings of the same
// sessions, so each option carries the sentence that says which — the labels are short enough to be
// ambiguous on their own.

import { UsageScope, UsageWindow, USAGE_WINDOWS } from '../model/usage/types';
import { WINDOW_BLURB, WINDOW_LABEL } from '../model/usage/window';
import { ChoiceOption } from './menu/choice-option';

export const WINDOW_OPTIONS: readonly ChoiceOption<UsageWindow>[] = USAGE_WINDOWS.map((window) => ({
  id: window,
  label: WINDOW_LABEL[window],
  hint: WINDOW_BLURB[window]
}));

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

