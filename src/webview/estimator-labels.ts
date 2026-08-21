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

// What picking it claims, and which models it's the right claim for — the second half is the part
// that actually decides it, since the panel can be pointed at a workspace using either.
export const ESTIMATOR_HINTS: Record<TokenEstimator, string> = {
  standard: 'Published rule of thumb. Prefer if using OpenAI models',
  anthropic: "Adjusted for Claude's latest tokenizer. Prefer if using Anthropic models"
};

// The line the hover card leads with — it says which approximation the number above it is, before
// offering to change it.
export const estimatorNote = (estimator: TokenEstimator): string =>
  estimator === 'standard'
    ? 'Estimated with the standard token approximation.'
    : "Estimated with the standard approximation, adjusted for Claude's tokenizer.";

export const EDIT_ESTIMATOR: string = 'Edit token estimator';

// The dialog's own subtitle. Says what these numbers are before offering a choice between two of
// them — neither option runs a tokenizer, and a dialog that didn't say so would imply otherwise.
export const ESTIMATOR_CAVEAT: string =
  'Token count is estimated based on character count, rather than actually embedding the strings.';
