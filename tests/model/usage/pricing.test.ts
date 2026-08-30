import { describe, expect, it } from 'vitest';
import { ModelRates, ratesFor, sumUsdParts, usdPartsFor, UsdParts } from '@src/model/usage/pricing';
import { EMPTY_TOKENS, UsageTokens } from '@src/model/usage/types';

const MILLION: number = 1_000_000;

const price = (model: string, tokens: Partial<UsageTokens>): number => {
  const parts: UsdParts | undefined = usdPartsFor({
    model,
    tokens: { ...EMPTY_TOKENS, ...tokens }
  });
  if (!parts) throw new Error(`no rates for ${model}`);
  return sumUsdParts(parts);
};

describe('ratesFor', () => {
  it('knows both providers', () => {
    expect(ratesFor('claude-opus-5')?.outputPerMTok).toBe(25);
    expect(ratesFor('gpt-5.6-terra')?.outputPerMTok).toBe(12);
  });

  it('prices a dated snapshot as its alias', () => {
    expect(ratesFor('claude-haiku-4-5-20251001')).toEqual(ratesFor('claude-haiku-4-5'));
    expect(ratesFor('gpt-5-2026-08-07')).toEqual(ratesFor('gpt-5'));
  });

  // The bug this guards: `gpt-5` prefixes every `gpt-5.x` string. Without a boundary, a version
  // that ships after this table was written prices silently at the older model's rate — which is
  // exactly the case that has to fall through to unpriced instead.
  it('does not let a shorter alias claim a later version', () => {
    expect(ratesFor('gpt-5.9-unheard-of')).toBeUndefined();
    expect(ratesFor('claude-opus-9')).toBeUndefined();
  });

  it('picks the longest alias where two could match', () => {
    expect(ratesFor('gpt-5.1-codex')?.inputPerMTok).toBe(1.25);
    expect(ratesFor('gpt-5.1-codex-2026-01-01')).toEqual(ratesFor('gpt-5.1-codex'));
  });

  it('carries the date its own provider\'s card was read', () => {
    const claude: ModelRates | undefined = ratesFor('claude-opus-5');
    const gpt: ModelRates | undefined = ratesFor('gpt-5.6-terra');

    expect(claude?.pricedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(gpt?.pricedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('usdPartsFor', () => {
  it('is undefined for a model with no rates, rather than zero', () => {
    expect(usdPartsFor({ model: 'gpt-5.9-unheard-of', tokens: EMPTY_TOKENS })).toBeUndefined();
  });

  it('prices output at the model rate', () => {
    expect(price('gpt-5.6-terra', { output: MILLION })).toBeCloseTo(12);
    expect(price('claude-opus-5', { output: MILLION })).toBeCloseTo(25);
  });

  it('prices a cache read at a tenth of input, both providers', () => {
    expect(price('gpt-5.6-terra', { cacheRead: MILLION })).toBeCloseTo(0.2);
    expect(price('claude-opus-5', { cacheRead: MILLION })).toBeCloseTo(0.5);
  });

  // The trap the OpenAI table exists around: OpenAI has no cache-write charge, so a written token is
  // billed as ordinary input. A 0× multiplier would drop it out of the bill entirely, and Codex
  // reports one on most turns — so what's asserted is that the split between the two fields cannot
  // change the price of an OpenAI prompt.
  it('bills an OpenAI cache write as plain input', () => {
    const asInput: number = price('gpt-5.6-terra', { input: MILLION });
    const asWrite: number = price('gpt-5.6-terra', { cacheWrite5m: MILLION });
    const split: number = price('gpt-5.6-terra', {
      input: MILLION / 2,
      cacheWrite5m: MILLION / 2
    });

    expect(asWrite).toBeCloseTo(asInput);
    expect(split).toBeCloseTo(asInput);
    expect(asInput).toBeCloseTo(2);
  });

  // Anthropic's is the opposite: a write costs more than input, and more again at the longer TTL.
  it('bills an Anthropic cache write above input, by TTL', () => {
    const input: number = price('claude-opus-5', { input: MILLION });

    expect(price('claude-opus-5', { cacheWrite5m: MILLION })).toBeCloseTo(input * 1.25);
    expect(price('claude-opus-5', { cacheWrite1h: MILLION })).toBeCloseTo(input * 2);
  });
});
