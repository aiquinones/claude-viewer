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
    cacheRead: tokens.cacheRead * CACHE_READ * perInputToken,
    cacheWrite:
      (tokens.cacheWrite5m * CACHE_WRITE_5M + tokens.cacheWrite1h * CACHE_WRITE_1H) * perInputToken
  };
};

// Every billed token, added up — what a cost basis of `all` means and what the API would charge.
// Which parts a figure actually counts is the setting's business, so that decision isn't made here.
export const sumUsdParts = (parts: UsdParts): number =>
  parts.input + parts.output + parts.cacheRead + parts.cacheWrite;

// The multipliers, for the card that explains a figure. Cache tokens are priced off the model's
// input rate, so these are what a reader needs on top of the two numbers in the table.
export const CACHE_MULTIPLIERS = {
  read: CACHE_READ,
  write5m: CACHE_WRITE_5M,
  write1h: CACHE_WRITE_1H
} as const;
