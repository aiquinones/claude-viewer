// The words on the context card. Here rather than inline for the reason `skill-budget-labels.ts`
// exists: the prose is the part that gets rewritten, and it shouldn't mean opening a component to
// do it.

import { ContextWindowSource } from '../model/sessions/context';
import { SettingSource } from '../model/settings/settings';

// Where a threshold came from. Same phrases the budgets card uses, minus the per-skill override —
// there's nothing to key one on here.
export const CONTEXT_SOURCE_LABELS: Record<SettingSource, string> = {
  workspace: 'set for this workspace',
  user: 'set by you',
  default: 'the default'
};

// Where the window came from. `table` names the date, because a table entry is the one number here
// that goes stale on someone else's release schedule.
export const CONTEXT_WINDOW_SOURCE_LABELS: Record<ContextWindowSource, string> = {
  override: 'your setting for this model',
  table: 'the built-in table',
  fallback: 'the fallback — this model isn’t in the built-in table'
};

// Why the colours exist at all. The card's one paragraph, and the reason it can't be dropped: a
// fifth of a bar painted yellow reads as a bug until this sentence explains it.
export const CONTEXT_NOTE: string =
  'Model hallucinations become more common as the context grows. These two thresholds are absolute — they don’t move with the window, because a 200k conversation is the same conversation whether the model holds 200k or 1M.';

// Said only when the session is bigger than the window it was measured against, which can mean
// nothing else.
export const CONTEXT_OVER_WINDOW_NOTE: string =
  'This session is already past the window assumed for its model, so that figure is wrong. Set it under claudeViewer.context.window.';

// The two rows of the card's threshold list. "Too big at" rather than "Error at": nothing has gone
// wrong at 300k, the conversation is just past the size worth trusting.
export const CONTEXT_LABELS = {
  warnAt: 'Warn at',
  errorAt: 'Too big at'
} as const;
