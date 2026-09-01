import { z } from 'zod';
import { Deliverable } from '../../types';
import { DELIVERABLE_MARKER, deliverablesInCommand } from '../deliverables';

// Claude's line shape for a declaration: an `assistant` line holding a `tool_use` block named
// `Bash`, whose `command` is the text the agent wrote. Mirrors `claude/skills.ts` — a per-CLI
// reader that finds the commands, over a parser that decides what one declares.
//
// It has to be the tool call specifically, not any line holding the marker. The instructions file
// is full of examples, so a raw scan over the log would declare them the moment an agent read the
// file — and reading a tool's *input* is a deliberate exception to `AgentRow`'s "the tool only,
// never its input": here the input is text the agent wrote *for* this panel.
const BASH_TOOL: string = 'Bash';

const blockSchema = z
  .object({
    type: z.string().optional(),
    name: z.string().optional(),
    input: z.object({ command: z.string().optional() }).passthrough().optional()
  })
  .passthrough();

const lineSchema = z
  .object({
    type: z.string(),
    message: z
      .object({ content: z.union([z.string(), z.array(blockSchema)]).optional() })
      .passthrough()
      .optional()
  })
  .passthrough();

interface ClaudeDeliverablesInArgs {
  lines: readonly string[];
  cwd: string;
}

export const claudeDeliverablesIn = ({ lines, cwd }: ClaudeDeliverablesInArgs): Deliverable[] => {
  const found: Deliverable[] = [];

  for (const line of lines) {
    // The prefilter, the same one every reader over this file uses: the marker is rare, and a line
    // that can't hold one shouldn't cost a JSON parse to rule out.
    if (!line.includes(DELIVERABLE_MARKER)) continue;

    for (const command of bashCommands(line)) {
      found.push(...deliverablesInCommand({ command, cwd }));
    }
  }

  return found;
};

// The `Bash` commands on one line. A user line's content is a plain string on a prompt and an array
// of blocks on a tool result, and only an assistant line's blocks carry a `tool_use`.
const bashCommands = (raw: string): string[] => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return [];
  }

  const parsed = lineSchema.safeParse(json);
  if (!parsed.success || parsed.data.type !== 'assistant') return [];

  const content = parsed.data.message?.content;
  if (!Array.isArray(content)) return [];

  return content
    .filter((block) => block.type === 'tool_use' && block.name === BASH_TOOL)
    .map((block) => block.input?.command)
    .filter((command): command is string => typeof command === 'string' && command.length > 0);
};
