// The words on the context card. Here rather than inline for the reason `skill-budget-labels.ts`
// exists: the prose is the part that gets rewritten, and it shouldn't mean opening a component to
// do it.

import { SettingSource } from '../model/settings/settings';

// Where a threshold came from. Same phrases the budgets card uses, minus the per-skill override —
// there's nothing to key one on here.
export const CONTEXT_SOURCE_LABELS: Record<SettingSource, string> = {
  workspace: 'set for this workspace',
  user: 'set by you',
  default: 'the default'
};

// Said only when the window is a guess about a model nothing here knows. The other two sources —
// the built-in table and your own setting — say nothing at all: naming them on every card was three
// phrases where two of them meant "this number is fine".
export const CONTEXT_FALLBACK_NOTE: string =
  'No context window on record for this model, so the figure above is your fallback. Set the real one under claudeViewer.context.window.';

// Why the colours exist at all — the card's one paragraph, and the only thing on the surface that
// says what a yellow bar is warning about.
export const CONTEXT_NOTE: string =
  'Model hallucinations become more common as the context grows. Try keeping your conversations lean.';

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
