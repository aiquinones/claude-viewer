// Tokens → dollars. The one file here that can go stale, which is why every rate carries the date
// it was read and why the cost card prints that date rather than presenting a bare figure.
//
// Two providers, because two of the three CLIs record tokens and no price: Claude Code writes what
// each request consumed, and so does Codex. Copilot needs none of this — it writes `total_nano_aiu`
// per request and the rates are inline in its event log.
//
// Nobody on a subscription pays these. That is as true of Claude Code on a plan as it is of Codex
// on one, which is why the figure is called an estimate everywhere it appears.

import { UsageTokens } from './types';

// Cache tokens are priced as multiples of the model's input rate, so a model needs two numbers
// rather than five.
export interface CacheRates {
  read: number;
  write5m: number;
  write1h: number;
}

// Anthropic prices a cache write above input and charges more for the longer TTL; a read is a tenth
// of input either way.
const ANTHROPIC_CACHE: CacheRates = { read: 0.1, write5m: 1.25, write1h: 2 };

// OpenAI has no cache-write charge at all — a written token is billed as ordinary input, which is
// what the 1× says. Every `cache_write_input_tokens` Codex has written on this machine reads zero,
// so a 0× here would be invisible until the day it isn't; the test is what holds the distinction.
const OPENAI_CACHE: CacheRates = { read: 0.1, write5m: 1, write1h: 1 };

export interface TokenRates {
  // US dollars per million tokens.
  inputPerMTok: number;
  outputPerMTok: number;
}

export interface ModelRates extends TokenRates {
  cache: CacheRates;
  // When these rates were read off the provider's pricing page. Per provider rather than per file:
  // rates move on Anthropic's and OpenAI's release schedules, not on each other's.
  pricedAt: string;
}

const PER_MTOK: number = 1_000_000;

// Keyed by the `model` string the log records, which is the alias rather than a dated snapshot id.
// An id absent here is reported by `aggregate`, not priced at zero.
const ANTHROPIC_RATES: Record<string, TokenRates> = {
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

// What Codex runs. The `-codex` variants aren't on the pricing page at all and take their base
// model's rate, which is what OpenAI has done for every one of them so far.
const OPENAI_RATES: Record<string, TokenRates> = {
  'gpt-5.6-sol': { inputPerMTok: 4, outputPerMTok: 20 },
  'gpt-5.6-terra': { inputPerMTok: 2, outputPerMTok: 12 },
  'gpt-5.6-luna': { inputPerMTok: 0.2, outputPerMTok: 1.2 },
  'gpt-5.5': { inputPerMTok: 5, outputPerMTok: 30 },
  'gpt-5.4': { inputPerMTok: 2.5, outputPerMTok: 15 },
  'gpt-5.4-mini': { inputPerMTok: 0.75, outputPerMTok: 4.5 },
  'gpt-5.4-nano': { inputPerMTok: 0.2, outputPerMTok: 1.25 },
  'gpt-5.2': { inputPerMTok: 1.75, outputPerMTok: 14 },
  'gpt-5.1-codex': { inputPerMTok: 1.25, outputPerMTok: 10 },
  'gpt-5.1': { inputPerMTok: 1.25, outputPerMTok: 10 },
  'gpt-5-codex': { inputPerMTok: 1.25, outputPerMTok: 10 },
  'gpt-5-mini': { inputPerMTok: 0.25, outputPerMTok: 2 },
  'gpt-5-nano': { inputPerMTok: 0.05, outputPerMTok: 0.4 },
  'gpt-5': { inputPerMTok: 1.25, outputPerMTok: 10 }
};

interface WithCacheArgs {
  rates: Record<string, TokenRates>;
  cache: CacheRates;
  pricedAt: string;
}

// One provider's rate card → the full entries. The cache rule and the date are stated once per
// provider rather than repeated on every row, which is what keeps the tables above readable as
// rate cards.
const withCache = ({ rates, cache, pricedAt }: WithCacheArgs): Record<string, ModelRates> =>
  Object.fromEntries(
    Object.entries(rates).map(([model, tokens]) => [model, { ...tokens, cache, pricedAt }])
  );

const RATES: Record<string, ModelRates> = {
  ...withCache({ rates: ANTHROPIC_RATES, cache: ANTHROPIC_CACHE, pricedAt: '2026-08-17' }),
  ...withCache({ rates: OPENAI_RATES, cache: OPENAI_CACHE, pricedAt: '2026-08-29' })
};

// A dated snapshot id (`claude-haiku-4-5-20251001`, `gpt-5-2026-08-07`) prices as its alias.
// Longest first, so `gpt-5.1` can't be matched by `gpt-5`.
const ALIASES: string[] = Object.keys(RATES).sort((left, right) => right.length - left.length);

// The alias has to end at a `-`, or `gpt-5` would claim every `gpt-5.x` that ships after this table
// was written and price it silently. A version bump is exactly the case that must fall through to
// unpriced instead.
const isSnapshotOf = (model: string, alias: string): boolean =>
  model.startsWith(`${alias}-`) || model === alias;

export const ratesFor = (model: string): ModelRates | undefined =>
  RATES[model] ?? RATES[ALIASES.find((alias) => isSnapshotOf(model, alias)) ?? ''];

// What the dollars are made of. Worth carrying separately because the composition is the surprising
// part: a week that produced 1.4M output tokens priced at $249 here, and $147 of that was *cache
// reads* — 294M of them, since every turn re-reads the context it's working in. A single total
// invites the reader to check it against the output figure, where it looks like an error.
export interface UsdParts {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export const EMPTY_USD_PARTS: UsdParts = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

export const USD_PART_KEYS = ['output', 'cacheRead', 'cacheWrite', 'input'] as const;

export type UsdPart = (typeof USD_PART_KEYS)[number];

interface UsdForArgs {
  model: string;
  tokens: UsageTokens;
}

// Undefined for a model with no rates, so the caller can name it rather than adding zero to a
// figure the reader would take as complete.
export const usdPartsFor = ({ model, tokens }: UsdForArgs): UsdParts | undefined => {
  const rates: ModelRates | undefined = ratesFor(model);
  if (!rates) return undefined;

  const perInputToken: number = rates.inputPerMTok / PER_MTOK;

  return {
    input: tokens.input * perInputToken,
    output: (tokens.output * rates.outputPerMTok) / PER_MTOK,
    cacheRead: tokens.cacheRead * rates.cache.read * perInputToken,
    cacheWrite:
      (tokens.cacheWrite5m * rates.cache.write5m + tokens.cacheWrite1h * rates.cache.write1h) *
      perInputToken
  };
};

// Every billed token, added up — what a cost basis of `all` means and what the API would charge.
// Which parts a figure actually counts is the setting's business, so that decision isn't made here.
export const sumUsdParts = (parts: UsdParts): number =>
  parts.input + parts.output + parts.cacheRead + parts.cacheWrite;
