import { z } from 'zod';

// The fields of an `assistant` transcript line that cost something. `sessions/transcript-schema.ts`
// reads the same file for a different question — what the agent is doing — so the two overlap in
// nothing but `type` and are kept apart rather than merged into one schema serving both.

// `cache_creation` splits the write by TTL, and the two are priced differently. Older transcripts
// carry only the flat `cache_creation_input_tokens`; those count as the cheaper 5-minute write,
// which is what the CLI defaults to.
const usageSchema = z
  .object({
    input_tokens: z.number().optional(),
    output_tokens: z.number().optional(),
    cache_read_input_tokens: z.number().optional(),
    cache_creation_input_tokens: z.number().optional(),
    cache_creation: z
      .object({
        ephemeral_5m_input_tokens: z.number().optional(),
        ephemeral_1h_input_tokens: z.number().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

const usageLineSchema = z
  .object({
    type: z.string(),
    // One request can span several lines carrying the same usage. This is what dedupes them.
    requestId: z.string().optional(),
    // The skill that was active when the request went out. Absent on most turns, which is not a
    // gap — it means no skill was running.
    attributionSkill: z.string().optional(),
    timestamp: z.string().optional(),
    sessionId: z.string().optional(),
    cwd: z.string().optional(),
    message: z
      .object({ model: z.string().optional(), usage: usageSchema.optional() })
      .passthrough()
      .optional()
  })
  .passthrough();

export type UsageLine = z.infer<typeof usageLineSchema>;

// Only `assistant` lines cost anything, and only they carry a `requestId` — thirteen line types
// share this file. The string test is a prefilter: it skips the JSON parse on the ~75% of lines that
// can't match, which is most of what a scan over 50MB of transcripts spends its time on.
export const parseUsageLine = (raw: string): UsageLine | undefined => {
  if (!raw.includes('"requestId"')) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = usageLineSchema.safeParse(json);
  if (!parsed.success || parsed.data.type !== 'assistant') return undefined;
  return parsed.data;
};

// A line that might say a skill was loaded. Both `assistant` and `user` lines qualify, and the
// content is a string on a prompt and an array of blocks on a tool result — so this reads the shape
// `usageLineSchema` deliberately leaves alone.
const contentBlockSchema = z
  .object({
    type: z.string().optional(),
    name: z.string().optional(),
    input: z.object({ skill: z.string().optional() }).passthrough().optional()
  })
  .passthrough();

const invocationLineSchema = z
  .object({
    type: z.string(),
    timestamp: z.string().optional(),
    attributionSkill: z.string().optional(),
    message: z
      .object({ content: z.union([z.string(), z.array(contentBlockSchema)]).optional() })
      .passthrough()
      .optional()
  })
  .passthrough();

export type InvocationLine = z.infer<typeof invocationLineSchema>;

// The three markers a line has to hold one of. Same prefilter idea as `parseUsageLine` — most of a
// transcript is neither a prompt nor a turn, and none of it should cost a JSON parse to find out.
const INVOCATION_MARKERS: readonly string[] = ['"Skill"', '<command-name>', 'attributionSkill'];

export const parseInvocationLine = (raw: string): InvocationLine | undefined => {
  if (!INVOCATION_MARKERS.some((marker) => raw.includes(marker))) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = invocationLineSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};
