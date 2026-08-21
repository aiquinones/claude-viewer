import { z } from 'zod';

// One `settings.json` of Claude Code's own — not `claudeViewer.*`. Only the one key is read, and
// everything else passes through: these files carry permissions, hooks and MCP blocks that this
// extension has no business parsing here.
//
// `cleanupPeriodDays` is the retention period in days. The docs put the minimum at 1 and say `0`
// fails validation, so a file claiming 0 is a file Claude Code itself rejects — it falls through to
// the next layer rather than being honoured or swapped for the default in place.
const claudeSettingsSchema = z
  .object({
    cleanupPeriodDays: z.number().int().min(1).optional()
  })
  .passthrough();

export type ClaudeSettings = z.infer<typeof claudeSettingsSchema>;

// One settings file's text → the retention period it sets, if it sets a usable one. Undefined
// covers all three ways a layer can decline to answer: not valid JSON, no key, or a value Claude
// Code would reject. The caller moves to the next layer for every one of them.
export const parseCleanupPeriod = (raw: string): number | undefined => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = claudeSettingsSchema.safeParse(json);
  return parsed.success ? parsed.data.cleanupPeriodDays : undefined;
};
