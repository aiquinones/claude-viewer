// How many tokens a model can hold. The one number this surface needs that is on no disk anywhere —
// not the transcript, not the session file, not settings.json — so it lives in a table here, shaped
// like `usage/pricing.ts` and carrying the same apology: the date it was read, and a setting to
// overrule it.

// When these windows were read off the Claude Code docs. Windows move on Anthropic's release
// schedule, not this extension's, which is why the card prints this rather than a bare number.
export const WINDOWS_READ_AT: string = '2026-08-19';

// Keyed by the alias the transcript records, which is what `message.model` holds — `claude-opus-5`
// rather than a dated snapshot id.
//
// The 1M entries are the ones worth checking against your own sessions: transcripts on this machine
// reach 410,600 tokens on `claude-opus-5`, which is proof that its window is not 200k, and is the
// measurement that made this table a table rather than one constant.
const WINDOWS: Record<string, number> = {
  'claude-opus-5': 1_000_000,
  'claude-sonnet-5': 1_000_000,
  'claude-fable-5': 1_000_000,
  'claude-opus-4-8': 200_000,
  'claude-opus-4-7': 200_000,
  'claude-opus-4-6': 200_000,
  'claude-opus-4-5': 200_000,
  'claude-sonnet-4-6': 200_000,
  'claude-sonnet-4-5': 200_000,
  'claude-haiku-4-5': 200_000
};

// A dated snapshot id (`claude-haiku-4-5-20251001`) resolves to its alias. Longest first, so
// `claude-opus-4-8` can't be claimed by a shorter key that happens to prefix it — the same
// resolution `pricing.ts` does, for the same ids.
const ALIASES: string[] = Object.keys(WINDOWS).sort((left, right) => right.length - left.length);

// Undefined for a model the table doesn't know, so the caller falls through to the setting rather
// than to a number nobody chose.
export const tableWindowFor = (model: string): number | undefined =>
  WINDOWS[model] ?? WINDOWS[ALIASES.find((alias) => model.startsWith(alias)) ?? ''];
