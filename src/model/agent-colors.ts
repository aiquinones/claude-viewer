import { z } from 'zod';
import { AGENT_COLORS, AgentColors } from './types';

// The colour map as it comes back out of the extension's own storage. This extension wrote it, but
// an older version of it may have written a different shape — so it's parsed like anything else,
// and one bad entry drops itself rather than the whole map.
const colorSchema = z.enum(AGENT_COLORS);

export const parseAgentColors = (raw: unknown): AgentColors => {
  const record = z.record(z.unknown()).safeParse(raw);
  if (!record.success) return {};

  const colors: AgentColors = {};
  for (const [sessionId, value] of Object.entries(record.data)) {
    const color = colorSchema.safeParse(value);
    if (color.success) colors[sessionId] = color.data;
  }
  return colors;
};
