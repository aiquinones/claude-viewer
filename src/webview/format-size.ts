// How a size reads in the panel. Shared by both surfaces — a skill and a CLAUDE.md are measured
// the same way, so they print the same way.

// 1.2k rather than 1234. The number is a rough estimate to begin with, so the digits it drops
// weren't saying anything.
export const formatTokens = (tokens: number): string =>
  tokens < 1000 ? `${tokens}` : `${(tokens / 1000).toFixed(1)}k`;

// A context figure, which runs to millions and is often a round number someone typed. `1M` rather
// than `1000.0k` or `1.00M`: a window is a stated size, and trailing zeros read as precision that
// was measured. A used figure keeps its one decimal, where it's carrying real digits.
export const formatContextTokens = (tokens: number): string => {
  if (tokens < 1_000) return `${tokens}`;
  if (tokens < 1_000_000) return `${trimZero(tokens / 1_000)}k`;
  return `${trimZero(tokens / 1_000_000)}M`;
};

const trimZero = (value: number): string => value.toFixed(1).replace(/\.0$/, '');

export const formatBytes = (chars: number): string =>
  chars < 1024 ? `${chars} B` : `${(chars / 1024).toFixed(1)} KB`;

// `many` is for the nouns an `s` doesn't pluralize — "memories", not "memorys".
export const plural = (count: number, noun: string, many?: string): string =>
  `${count} ${count === 1 ? noun : (many ?? `${noun}s`)}`;
