import { z } from 'zod';
import { Deliverable } from '../../types';
import { DELIVERABLE_MARKER, deliverablesInCommand } from '../deliverables';

// Copilot's line shape for a declaration: a `tool.execution_start` whose `toolName` is `bash`, with
// the command in `arguments.command`. The cleanest of the three — one nesting, no unwrapping.
//
// Same rule as the other two about it being the tool call: the prompt and the reply are in this log
// as `user.message` and `assistant.message`, and a `tool.execution_complete` carries the echo's own
// output, so three other line types here hold the marker without declaring anything.
//
// `tool.execution_start` is not marked ephemeral in the SDK, which is what makes it readable at all
// — see the gotcha about the events that never reach disk.
const BASH_TOOL: string = 'bash';

const lineSchema = z
  .object({
    type: z.string(),
    data: z
      .object({
        toolName: z.string().optional(),
        // Copilot also puts `shellToolInfo.hasWriteFileRedirection` on this event — its own answer
        // to the question `writesToFile` asks. Deliberately not read: one rule across three CLIs
        // beats a better rule on one of them, and the two agree on every case measured here.
        arguments: z.object({ command: z.string().optional() }).passthrough().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

interface CopilotDeliverablesInArgs {
  lines: readonly string[];
  cwd: string;
}

export const copilotDeliverablesIn = ({
  lines,
  cwd
}: CopilotDeliverablesInArgs): Deliverable[] => {
  const found: Deliverable[] = [];

  for (const line of lines) {
    // The prefilter. One event here can run to 77KB — see the gotcha — so ruling a line out by
    // substring before parsing it matters more on this log than on the other two.
    if (!line.includes(DELIVERABLE_MARKER)) continue;

    const command: string | undefined = bashCommand(line);
    if (command) found.push(...deliverablesInCommand({ command, cwd }));
  }

  return found;
};

const bashCommand = (raw: string): string | undefined => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const parsed = lineSchema.safeParse(json);
  if (!parsed.success || parsed.data.type !== 'tool.execution_start') return undefined;
  if (parsed.data.data?.toolName !== BASH_TOOL) return undefined;

  return parsed.data.data.arguments?.command || undefined;
};
