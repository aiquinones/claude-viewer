import { z } from 'zod';

// One line of `events.jsonl`. Every event shares this envelope, so unlike the Claude transcript
// there's no per-type shape to narrow before the type discriminator can be read.
//
// The fields read here are the four a row needs. The rest of `data` passes through: this format
// carries dozens of event types and drifts between releases, and an unknown one has to be skippable
// rather than fatal.
const eventSchema = z
  .object({
    type: z.string(),
    timestamp: z.string().optional(),
    data: z
      .object({
        // tool.execution_start / tool.execution_complete
        toolName: z.string().optional(),
        toolCallId: z.string().optional(),
        // The MCP server hosting the tool, when it's an MCP tool. Prefixed onto the name so
        // `github` and a local `bash` don't read alike.
        mcpServerName: z.string().optional(),
        // permission.requested / permission.completed
        requestId: z.string().optional(),
        // user.message
        content: z.string().optional(),
        // session.start
        copilotVersion: z.string().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type CopilotEvent = z.infer<typeof eventSchema>;

// A torn line is expected at both ends of a windowed read, so an unparseable one is skipped in
// silence. Anything that logged these would log constantly.
export const parseEvent = (raw: string): CopilotEvent | undefined => {
  const trimmed: string = raw.trim();
  if (!trimmed.startsWith('{')) return undefined;

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    return undefined;
  }

  const parsed = eventSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};
