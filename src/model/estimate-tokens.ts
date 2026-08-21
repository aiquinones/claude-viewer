// How many tokens a piece of text costs, without running a tokenizer. Two approximations rather
// than one, because the rule of thumb and Claude's current tokenizer disagree by a third and both
// answers are worth being able to read. Every place the number surfaces says "est.".
//
// Takes the count rather than the text: every caller already holds `chars`, and so do the stories.
// One home means the surfaces can't drift into two different estimates of the same thing.

// The order the dialog lists them in, and the ids the setting accepts.
//
// Deliberately not annotated: a type here would erase the literals `TokenEstimator` derives from.
export const TOKEN_ESTIMATORS = ['standard', 'anthropic'] as const;

export type TokenEstimator = (typeof TOKEN_ESTIMATORS)[number];

// The published rule of thumb for English prose. It's what every number in this panel has always
// meant, which is the only reason it's the default.
export const CHARS_PER_TOKEN: number = 4;

// How much denser Claude's current tokenizer runs than that rule. A claim, not a measurement made
// here — the same status the context-window table has, and it moves on Anthropic's schedule rather
// than on this extension's. Read 2026-08.
export const ANTHROPIC_FACTOR: number = 1.35;

export const ESTIMATOR_FACTORS: Record<TokenEstimator, number> = {
  standard: 1,
  anthropic: ANTHROPIC_FACTOR
};

interface EstimateTokensArgs {
  chars: number;
  estimator: TokenEstimator;
}

export const estimateTokens = ({ chars, estimator }: EstimateTokensArgs): number =>
  Math.round((chars / CHARS_PER_TOKEN) * ESTIMATOR_FACTORS[estimator]);
