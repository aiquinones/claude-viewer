// What each estimator is called and what it claims. Prose in one place, so the hover card, the
// dialog and the drawing can't describe the same setting three different ways.

import { ANTHROPIC_FACTOR, CHARS_PER_TOKEN, TokenEstimator } from '../model/estimate-tokens';

export const ESTIMATOR_LABELS: Record<TokenEstimator, string> = {
  standard: 'Standard estimator',
  anthropic: 'Anthropic estimator'
};

// The formula, in the mono face, as the card's second line. Short enough to read at a glance —
// the reason for it is the sentence under it.
export const ESTIMATOR_FORMULAS: Record<TokenEstimator, string> = {
  standard: `chars ÷ ${CHARS_PER_TOKEN}`,
  anthropic: `chars ÷ ${CHARS_PER_TOKEN} × ${ANTHROPIC_FACTOR}`
};

// What picking it claims. One sentence: the dialog is where the longer version lives.
export const ESTIMATOR_HINTS: Record<TokenEstimator, string> = {
  standard: 'The published rule of thumb, and what this panel has always shown.',
  anthropic: `Adjusted for Claude's current tokenizer, which runs denser than ${CHARS_PER_TOKEN} characters per token.`
};

// The line the hover card leads with — it says which approximation the number above it is, before
// offering to change it.
export const estimatorNote = (estimator: TokenEstimator): string =>
  estimator === 'standard'
    ? 'Estimated with the standard token approximation.'
    : "Estimated with the standard approximation, adjusted for Claude's tokenizer.";

export const EDIT_ESTIMATOR: string = 'Edit token estimator';

// Said once in the hover card, because it's the consequence people don't expect: the budget bars
// don't move when the estimator does, so every skill gets closer to its limit at once.
export const BUDGET_NOTE: string =
  'Budgets are read in these units, so switching moves every number against the same limits.';

// The dialog's own subtitle. Nothing here runs a tokenizer, and a panel that let you pick between
// two of them without saying so would be claiming more than it can.
export const ESTIMATOR_CAVEAT: string =
  'Neither runs a real tokenizer — an estimate is worth having because it costs one division. Both are claims about how Claude reads text.';
