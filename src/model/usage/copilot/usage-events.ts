import { z } from 'zod';

// The three events the usage surface reads, out of the twenty-odd that share `events.jsonl`.
// `sessions/copilot/event-schema.ts` reads the same file for what an agent is doing right now; this
// reads it for what the session cost, and the two ask for different fields off the same envelope.

const usageEventSchema = z
  .object({
    type: z.string(),
    timestamp: z.string().optional(),
    data: z
      .object({
        // assistant.message. Copilot records the output side only — there is no input count on disk.
        messageId: z.string().optional(),
        model: z.string().optional(),
        outputTokens: z.number().optional(),
        // skill.invoked. `content` is the whole SKILL.md inline — the windowed scan wants only the
        // name, and `invocations.ts` measures the body that was actually loaded.
        name: z.string().optional(),
        content: z.string().optional(),
        // session.usage_checkpoint. A running total for the session, not a per-request figure.
        totalNanoAiu: z.number().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type UsageEvent = z.infer<typeof usageEventSchema>;

export const USAGE_EVENT_TYPES: readonly string[] = [
  'assistant.message',
  'skill.invoked',
  'session.usage_checkpoint'
];

// One line → an event worth reading, or undefined. The cheap string test first: an
// `assistant.message` line runs about 10KB with its inlined `encryptedContent`, and one
// `system.message` measured 77KB, so parsing every line to discard most of them is the expensive way
// to do this.
export const parseUsageEvent = (raw: string): UsageEvent | undefined => {
  const trimmed: string = raw.trim();
  if (!trimmed.startsWith('{')) return undefined;
  if (!USAGE_EVENT_TYPES.some((type) => trimmed.includes(`"${type}"`))) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    return undefined;
  }

  const parsed = usageEventSchema.safeParse(json);
  if (!parsed.success || !USAGE_EVENT_TYPES.includes(parsed.data.type)) return undefined;
  return parsed.data;
};
