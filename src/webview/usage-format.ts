// How a usage figure prints. The surface reads cost, which is dollars on a Claude row and AIU on a
// Copilot one — different units with no conversion between them, so each prints on its own terms and
// neither is ever added to the other. Tokens still print inside the pricing card.

import { UsdPart } from '../model/usage/pricing';
import { UsageSlice, UsageTotals } from '../model/usage/types';

// A week of turns runs to millions, which `format-size`'s `k` alone can't say. Same idea though:
// the digits dropped weren't carrying anything.
export const formatUsageTokens = (tokens: number): string => {
  if (tokens < 1_000) return `${tokens}`;
  if (tokens < 1_000_000) return `${(tokens / 1_000).toFixed(1)}k`;
  return `${(tokens / 1_000_000).toFixed(2)}M`;
};

// Dollars, and the small end matters: most skills cost cents. Anything under a cent says so rather
// than rounding to `$0.00`, which reads as free.
export const formatUsd = (usd: number): string => {
  if (usd === 0) return '$0';
  if (usd < 0.01) return '<$0.01';
  if (usd < 100) return `$${usd.toFixed(2)}`;
  return `$${Math.round(usd)}`;
};

// Copilot bills in AIU and records it in billionths. The unit is printed rather than assumed —
// it's the one number on this surface that isn't dollars or tokens.
export const formatAiu = (nanoAiu: number): string => {
  const aiu: number = nanoAiu / 1_000_000_000;
  if (aiu === 0) return '0 AIU';
  if (aiu < 0.01) return '<0.01 AIU';
  return `${aiu.toFixed(2)} AIU`;
};

// A share under a percent still isn't nothing, and `0%` next to a real number reads as a bug.
export const formatShare = (fraction: number): string => {
  const percent: number = fraction * 100;
  if (percent > 0 && percent < 1) return '<1%';
  return `${Math.round(percent)}%`;
};

// What one slice costs. Two units, so a slice showing both is a slice fed by both CLIs — that's the
// only place they're printed together, and never added.
export const formatSliceValue = (slice: UsageSlice): string => formatCost(slice);

const formatCost = (totals: UsageTotals): string => {
  const parts: string[] = [];
  if (totals.usd > 0) parts.push(formatUsd(totals.usd));
  if (totals.nanoAiu > 0) parts.push(formatAiu(totals.nanoAiu));
  return parts.length === 0 ? '—' : parts.join(' + ');
};

// The name a slice draws. Turns with no skill are a real row, not a gap: leaving them out would
// make the percentages look like a breakdown that doesn't add up.
export const sliceLabel = (slice: UsageSlice): string => slice.skill ?? 'No skill';

// What each piece of the dollar figure is. `cacheRead` is the one worth naming plainly: it's usually
// the largest share and it's the least obvious, since nothing about it shows up in a token count
// anyone looks at.
export const USD_PART_LABEL: Record<UsdPart, string> = {
  output: 'Output',
  cacheRead: 'Cache reads',
  cacheWrite: 'Cache writes',
  input: 'Input'
};

// Rates print as whole dollars where they are whole dollars — $5, not $5.00 — since the table is
// read as a rate card rather than as an amount.
export const formatRate = (perMTok: number): string =>
  Number.isInteger(perMTok) ? `$${perMTok}` : `$${perMTok.toFixed(2)}`;
