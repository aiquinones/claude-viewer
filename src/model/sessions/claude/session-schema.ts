import { z } from 'zod';

// `~/.claude/sessions/<pid>.json`, written by Claude Code at startup. Not a documented format and
// the newest thing this extension reads, so only the three fields a row can't be built without are
// required — everything else degrades to a default and unknown keys pass through.
const sessionFileSchema = z
  .object({
    pid: z.number(),
    sessionId: z.string(),
    cwd: z.string(),
    name: z.string().optional(),
    startedAt: z.number().optional(),
    version: z.string().optional(),
    entrypoint: z.string().optional(),
    kind: z.string().optional(),
    // The peer messaging socket. Its existence corroborates that the process is alive; nothing
    // here ever opens it.
    messagingSocketPath: z.string().optional()
  })
  .passthrough();

export type SessionFile = z.infer<typeof sessionFileSchema>;

// One file's text → the session it describes, or undefined if it's malformed. A file that doesn't
// parse is skipped rather than reported: it isn't config someone wrote, it's a runtime artifact,
// and the process it named is the one thing a row can't do without.
export const parseSessionFile = (raw: string): SessionFile | undefined => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = sessionFileSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
};
