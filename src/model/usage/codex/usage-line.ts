import { z } from 'zod';

// The three lines the usage scan reads out of a `rollout-*.jsonl`. A peer of
// `sessions/codex/rollout-schema.ts` rather than an extension of it: that one is shaped for the tail
// rule, which reads turn markers and a pending tool, and this one reads counters. The same split
// Claude's `usage-schema.ts` and `transcript-schema.ts` already have.
//
//   * `event_msg/token_count`   — what one request cost. One line per request.
//   * `turn_context`            — the model the next requests run under. It changes mid-session.
//   * `session_meta`            — the head of the file, read for the CLI version and nothing else.
//
// Everything else passes through. This format drifts between Codex releases and inlines whole
// system prompts, so an unknown line is skipped rather than fatal.

// One side of a `token_count`. Codex's convention is Copilot's, not Claude's: `input_tokens` is the
// whole prompt and `cached_input_tokens` is a *breakdown* of it. There is nothing to add up.
const tokenUsageSchema = z
  .object({
    input_tokens: z.number().optional(),
    cached_input_tokens: z.number().optional(),
    cache_write_input_tokens: z.number().optional(),
    output_tokens: z.number().optional(),
    // A subset of `output_tokens`, so it is a breakdown line and never an addend. Read here so the
    // shape is on record; nothing renders it yet.
    reasoning_output_tokens: z.number().optional()
  })
  .passthrough();

export type CodexTokenUsage = z.infer<typeof tokenUsageSchema>;

const usageLineSchema = z
  .object({
    type: z.string(),
    timestamp: z.string().optional(),
    // Unique within a file, and what a turn is deduped on. Absent on rollouts written before Codex
    // added it — see `turnId` in `scan.ts` for what stands in.
    ordinal: z.number().optional(),
    payload: z
      .object({
        type: z.string().optional(),
        // turn_context. The model can change mid-session, so this is read per turn rather than once.
        model: z.string().optional(),
        // session_meta.
        cli_version: z.string().optional(),
        // token_count. `last_token_usage` is the request just made; `total_token_usage` accumulates
        // over the session and would bill every turn for every turn before it.
        //
        // Null on some older lines rather than absent, which `.catch` is what survives.
        info: z
          .object({ last_token_usage: tokenUsageSchema.optional() })
          .passthrough()
          .optional()
          .catch(undefined)
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type CodexUsageLine = z.infer<typeof usageLineSchema>;

// A torn line is expected at both ends of an appended read, so an unparseable one is skipped in
// silence — the same rule every other log reader here follows.
export const parseCodexUsageLine = (raw: string): CodexUsageLine | undefined => {
  const trimmed: string = raw.trim();
  if (!trimmed.startsWith('{')) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    return undefined;
  }

  const parsed = usageLineSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};
