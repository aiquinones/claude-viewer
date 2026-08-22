// How many tokens a model can hold. The one number this surface needs that is on no disk anywhere —
// not the transcript, not the session file, not settings.json, and not Copilot's event log or its
// usage database — so it lives in a table here, shaped like `usage/pricing.ts` and carrying the same
// apology: the date it was read, and a setting to overrule it.

// When these windows were read. Windows move on the model vendors' release schedules, not this
// extension's, which is why the card prints this rather than a bare number.
export const WINDOWS_READ_AT: string = '2026-08-21';

// Keyed by the alias the log records, which is what `message.model` holds for Claude and what
// `assistant_usage_events.model` holds for Copilot — `claude-opus-5` rather than a dated snapshot id.
//
// The 1M Claude entries are the ones worth checking against your own sessions: transcripts on this
// machine reach 410,600 tokens on `claude-opus-5`, which is proof that its window is not 200k, and is
// the measurement that made this table a table rather than one constant.
//
// The GPT entries are the weakest claims here, and the GPT-5.6 family is the weakest of those. The
// model itself holds 1,050,000, but a harness is free to ask for less — Codex CLI reports 272,000 for
// the same three models, to stay under a pricing threshold — and which figure Copilot CLI asks for is
// published nowhere and written to no file it leaves behind. 1M is the model's own number; override
// it under `claudeViewer.context.window` if your own sessions say otherwise.
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
  'claude-haiku-4-5': 200_000,
  'gpt-5-6-sol': 1_000_000,
  'gpt-5-6-terra': 1_000_000,
  'gpt-5-6-luna': 1_000_000,
  'gpt-5-codex': 400_000,
  'gpt-5-mini': 400_000
};

// The two CLIs spell the same model differently: Claude Code writes `claude-haiku-4-5`, Copilot writes
// `claude-haiku-4.5`, and OpenAI's own ids carry a dot as well (`gpt-5.6-sol`). Every key above is in
// the dashed form and lookups normalize into it, so one model is one row rather than two that drift.
const normalize = (model: string): string => model.replace(/\./g, '-');

// A dated snapshot id (`claude-haiku-4-5-20251001`) resolves to its alias, and so does a suffixed one
// (`claude-opus-4-8-fast`). Longest first, so `claude-opus-4-8` can't be claimed by a shorter key that
// happens to prefix it — the same resolution `pricing.ts` does, for the same ids.
const ALIASES: string[] = Object.keys(WINDOWS).sort((left, right) => right.length - left.length);

// Undefined for a model the table doesn't know, so the caller falls through to the setting rather
// than to a number nobody chose.
export const tableWindowFor = (model: string): number | undefined => {
  const key: string = normalize(model);
  return WINDOWS[key] ?? WINDOWS[ALIASES.find((alias) => key.startsWith(alias)) ?? ''];
};
