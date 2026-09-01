import { z } from 'zod';
import { Deliverable } from '../../types';
import { DELIVERABLE_MARKER, deliverablesInCommand } from '../deliverables';

// Codex's line shape for a declaration. It records a shell call twice and this reads the cleaner of
// the two: an `event_msg` / `item_completed` carrying a `CommandExecution`, whose `command` is a
// proper argv array.
//
// The other is a `response_item` / `custom_tool_call` named `exec`, whose `input` is a *JavaScript*
// snippet — `tools.exec_command({cmd:"…"})` — so the command sits inside a JS string inside JSON and
// arrives double-escaped. Same command, two spellings; this one needs no unwrapping.
//
// As with Claude it has to be the tool call rather than any line holding the marker: the prompt that
// asked for it and the reply describing it are both in the log, as `UserMessage` and `AgentMessage`.
const COMMAND_ITEM: string = 'CommandExecution';

const itemSchema = z
  .object({
    type: z.string().optional(),
    command: z.array(z.string()).optional()
  })
  .passthrough();

const lineSchema = z
  .object({
    type: z.string(),
    payload: z
      .object({ type: z.string().optional(), item: itemSchema.optional() })
      .passthrough()
      .optional()
  })
  .passthrough();

interface CodexDeliverablesInArgs {
  lines: readonly string[];
  cwd: string;
}

export const codexDeliverablesIn = ({ lines, cwd }: CodexDeliverablesInArgs): Deliverable[] => {
  const found: Deliverable[] = [];

  for (const line of lines) {
    // The cheap gate every reader over a rollout uses. These lines inline whole system prompts, so
    // a full parse of each one is the cost worth avoiding.
    if (!line.includes(DELIVERABLE_MARKER)) continue;

    const command: string | undefined = execCommand(line);
    if (command) found.push(...deliverablesInCommand({ command, cwd }));
  }

  return found;
};

// The argv joined back into one string. `["/bin/zsh", "-lc", "echo '…'"]` is the shape here, so the
// declaration is in the last element — but joining rather than taking it keeps a bare
// `["echo", "…"]` working too, and puts any redirect ahead of the marker where `writesToFile`
// looks for it.
const execCommand = (raw: string): string | undefined => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = lineSchema.safeParse(json);
  if (!parsed.success || parsed.data.type !== 'event_msg') return undefined;

  const item = parsed.data.payload?.item;
  if (item?.type !== COMMAND_ITEM || !item.command?.length) return undefined;

  return item.command.join(' ');
};
