// characters / 4. A heuristic, not a tokenizer — it exists to answer "has this gotten out of hand",
// and for that, rough is enough. Every place the number surfaces says "est.".
//
// Takes the count rather than the text: both surfaces already hold `chars`, and so do the stories.
// One home means the two can't drift into two different estimates of the same thing.
export const estimateTokens = (chars: number): number => Math.round(chars / 4);
