// Tokens → dollars, for Claude. The one file here that can go stale, which is why it carries the
// date it was priced and why the cost view prints that date rather than presenting a bare figure.
//
// Copilot needs none of this: it writes `total_nano_aiu` per request and the rates are inline in
// the event log. Only Claude records tokens alone.

import { UsageTokens } from './types';

// When these rates were read off the Claude Code docs. Rates move on Anthropic's release schedule,
// not this extension's — Sonnet 5's introductory $2/$10 expires 2026-08-31, a fortnight after this
// was written, which is the whole argument for showing the date.
export const PRICED_AT: string = '2026-08-17';

export interface ModelRates {
  // US dollars per million tokens.
  inputPerMTok: number;
  outputPerMTok: number;
}

// Cache tokens are priced as multiples of the model's input rate, so a new model needs two numbers
// rather than five. Writes cost more at the longer TTL; reads are a tenth of input either way.
const CACHE_WRITE_5M: number = 1.25;
const CACHE_WRITE_1H: number = 2;
const CACHE_READ: number = 0.1;

const PER_MTOK: number = 1_000_000;

// Keyed by the `model` string the transcript records, which is the alias rather than a dated
// snapshot id. An id absent here is reported by `aggregate`, not priced at zero.
const RATES: Record<string, ModelRates> = {
  'claude-opus-5': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-8': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-7': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-6': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-5': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-sonnet-5': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-sonnet-4-6': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-sonnet-4-5': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
  'claude-fable-5': { inputPerMTok: 10, outputPerMTok: 50 },
  'claude-mythos-5': { inputPerMTok: 10, outputPerMTok: 50 }
};

// A dated snapshot id (`claude-haiku-4-5-20251001`) prices as its alias. Longest alias first, so
// `claude-opus-4-8` can't be matched by a shorter key that happens to prefix it.
const ALIASES: string[] = Object.keys(RATES).sort((left, right) => right.length - left.length);

export const ratesFor = (model: string): ModelRates | undefined =>
  RATES[model] ?? RATES[ALIASES.find((alias) => model.startsWith(alias)) ?? ''];

interface UsdForArgs {
  model: string;
  tokens: UsageTokens;
}

// Undefined for a model with no rates, so the caller can name it rather than adding zero to a
// figure the reader would take as complete.
export const usdFor = ({ model, tokens }: UsdForArgs): number | undefined => {
  const rates: ModelRates | undefined = ratesFor(model);
  if (!rates) return undefined;

  const input: number =
    tokens.input +
    tokens.cacheWrite5m * CACHE_WRITE_5M +
    tokens.cacheWrite1h * CACHE_WRITE_1H +
    tokens.cacheRead * CACHE_READ;

  return (input * rates.inputPerMTok + tokens.output * rates.outputPerMTok) / PER_MTOK;
};
