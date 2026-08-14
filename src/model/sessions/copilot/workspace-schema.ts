import { z } from 'zod';
import { parseFlatFields } from '../../../config/frontmatter';

// `~/.copilot/session-state/<id>/workspace.yaml`, written when the session starts and rewritten as
// its title and clock move. Flat scalars only, which is why it goes through the frontmatter field
// reader rather than a YAML parser.
//
// Only `cwd` is required: it's what groups a row and what a row falls back to for a name. Everything
// else degrades, the same way the Claude session file does.
const workspaceSchema = z
  .object({
    id: z.string().optional(),
    cwd: z.string(),
    git_root: z.string().optional(),
    repository: z.string().optional(),
    branch: z.string().optional(),
    // The session's display name. Unlike Claude's title there's no choosing to do — the file holds
    // the current one, because `session.title_changed` is ephemeral and never reaches the log.
    name: z.string().optional(),
    // Whether the user typed that name or Copilot generated it. Not read yet; kept because it's the
    // one thing that would let the view treat the two differently.
    user_named: z.string().optional(),
    // Which client opened the session — `github/cli` for the terminal CLI.
    client_name: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
  })
  .passthrough();

export type CopilotWorkspace = z.infer<typeof workspaceSchema>;

// One file's text → the session it describes, or undefined if it's unusable. A list field would be
// a malformed scalar here, so anything that isn't a string is dropped before validation rather than
// failing the whole file.
export const parseWorkspaceFile = (raw: string): CopilotWorkspace | undefined => {
  const fields: Record<string, string | string[]> = parseFlatFields(raw);
  const scalars: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string') scalars[key] = value;
  }

  const parsed = workspaceSchema.safeParse(scalars);
  return parsed.success ? parsed.data : undefined;
};
