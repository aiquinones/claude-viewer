import { z } from 'zod';

// One line of a `.jsonl` transcript. Thirteen line types share the file and only four fields are
// ever read here, so this validates those and passes the rest through — the format is undocumented
// and the newest thing the extension reads, so a line that grows a key must not become an error.
const blockSchema = z.object({ type: z.string(), name: z.string().optional() }).passthrough();

const transcriptLineSchema = z
  .object({
    type: z.string(),
    // `ai-title` and `last-prompt` lines. Both are rewritten as the session goes on; the last one
    // in the file wins.
    aiTitle: z.string().optional(),
    lastPrompt: z.string().optional(),
    // An assistant turn that ended in an API error. The turn is over either way.
    isApiErrorMessage: z.boolean().optional(),
    // `pr-link` lines. Rewritten like the title is, and always the same PR within one session.
    prNumber: z.number().optional(),
    prUrl: z.string().optional(),
    // A bare string appears in place of the block array on a small number of user lines.
    message: z
      .object({ content: z.union([z.string(), z.array(blockSchema)]).optional() })
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
