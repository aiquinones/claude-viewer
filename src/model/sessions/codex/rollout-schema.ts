import { z } from 'zod';

// One line of a `rollout-*.jsonl`. Every line shares this envelope and the discriminator sits one
// level down, on `payload.type` — `type` at the top only says which stream the line belongs to
// (`event_msg` for the session's own lifecycle, `response_item` for what went to and from the model).
// So both are read, and the pair is what the tail rule matches on.
//
// The rest passes through. This format carries a couple of dozen payload types, drifts between Codex
// releases, and inlines whole system prompts — an unknown line has to be skippable rather than fatal.
const rolloutLineSchema = z
  .object({
    type: z.string(),
    payload: z
      .object({
        type: z.string().optional(),
        // custom_tool_call / function_call, and their matching `*_output` lines. The call id pairs
        // the two — Codex can have more than one call open, so position alone doesn't say which
        // finished.
        name: z.string().optional(),
        call_id: z.string().optional(),
        // token_count. `last_token_usage` is the request just made; `total_token_usage` accumulates
        // over the session and is not what a context bar measures.
        info: z
          .object({
            last_token_usage: z.object({ input_tokens: z.number().optional() }).passthrough().optional(),
            model_context_window: z.number().optional()
          })
          .passthrough()
          .optional()
          .catch(undefined),
        // task_started. The window is stated here too, which is what a session with no finished
        // request reads it from.
        model_context_window: z.number().optional(),
        // item_completed. The friendly stream — `item.type` names what finished, and a `UserMessage`
        // carries the prompt.
        item: z
          .object({
            type: z.string().optional(),
            content: z
              .array(z.object({ text: z.string().optional() }).passthrough())
              .optional()
              .catch(undefined)
          })
          .passthrough()
          .optional()
          .catch(undefined)
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type RolloutLine = z.infer<typeof rolloutLineSchema>;

// A torn line is expected at both ends of a windowed read, so an unparseable one is skipped in
// silence. Anything that logged these would log constantly.
export const parseRolloutLine = (raw: string): RolloutLine | undefined => {
  const trimmed: string = raw.trim();
  if (!trimmed.startsWith('{')) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    return undefined;
  }

  const parsed = rolloutLineSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};

// The pair that identifies a line, as one string — `event_msg/task_started`. The tail rule reads
// this rather than the two fields, since every case it matches is a pair.
export const lineKind = (line: RolloutLine): string => `${line.type}/${line.payload?.type ?? ''}`;
