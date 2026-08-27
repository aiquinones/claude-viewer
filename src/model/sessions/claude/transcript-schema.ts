import { z } from 'zod';

// One line of a `.jsonl` transcript. Thirteen line types share the file and only four fields are
// ever read here, so this validates those and passes the rest through — the format is undocumented
// and the newest thing the extension reads, so a line that grows a key must not become an error.
const blockSchema = z.object({ type: z.string(), name: z.string().optional() }).passthrough();

// What one request carried into the model. `usage/claude/usage-schema.ts` reads the same block for a
// different question — what the turn cost — and the two stay apart rather than merging into one
// schema serving both. Here only the three input figures matter: their sum is the context size, and
// output isn't in it because what the model wrote this turn is counted in the next request's input.
const usageSchema = z
  .object({
    input_tokens: z.number().optional(),
    cache_read_input_tokens: z.number().optional(),
    cache_creation_input_tokens: z.number().optional()
  })
  .passthrough();

const transcriptLineSchema = z
  .object({
    type: z.string(),
    // `ai-title` and `last-prompt` lines. Both are rewritten as the session goes on; the last one
    // in the file wins.
    aiTitle: z.string().optional(),
    lastPrompt: z.string().optional(),
    // An assistant turn that ended in an API error. The turn is over either way.
    isApiErrorMessage: z.boolean().optional(),
    // Set on a `user` line the CLI wrote itself rather than one you typed — the caveat block a
    // slash command emits ahead of the command. Never a prompt.
    isMeta: z.boolean().optional(),
    // `pr-link` lines. Rewritten like the title is, and always the same PR within one session.
    prNumber: z.number().optional(),
    prUrl: z.string().optional(),
    // A bare string appears in place of the block array on a small number of user lines.
    message: z
      .object({
        content: z.union([z.string(), z.array(blockSchema)]).optional(),
        // Which model answered, and how full its context was. Both off the same line: the window a
        // reading is measured against depends on the model, and only the line knows which one ran.
        model: z.string().optional(),
        // Why the model stopped. One response is written as several lines — the thinking, the prose
        // and the tool call each get their own — and every one of them carries the reason the whole
        // response ended, so this is what says whether a text-only line is the end of a turn or the
        // middle of one. Null on a response that was cut off mid-stream.
        stop_reason: z.string().nullish(),
        usage: usageSchema.optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type TranscriptLine = z.infer<typeof transcriptLineSchema>;

export type ContentBlock = z.infer<typeof blockSchema>;

// One line → the fields worth reading, or undefined. Undefined is routine rather than a failure:
// the first line of a tail read is half a line, and the last one can be torn mid-append.
export const parseTranscriptLine = (raw: string): TranscriptLine | undefined => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = transcriptLineSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};
