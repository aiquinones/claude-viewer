// Copilot's side of the history. Nothing incremental here: `usage/copilot/scan.ts` already reads
// every event log whole on every pass — a checkpoint's cost is shared out over the turns before it,
// so there is no offset to resume from — and the logs are a couple of megabytes in total.
//
// Which means the history costs one extra pass over them and no new parsing rules.

import { join } from 'node:path';
import { copilotSessionStateDir, copilotWorkspacePath } from '../../../config/paths';
import { listDirectories, readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { CopilotWorkspace, parseWorkspaceFile } from '../../sessions/copilot/workspace-schema';
import { scanCopilotUsage } from '../copilot/scan';
import { UsageTurn } from '../types';
import { foldTurns, SessionFold } from './fold';

export const scanCopilotHistory = async (): Promise<SessionFold[]> => {
  // Everything, not a window: `since: 0` is what makes this the history rather than the last week.
  const turns: UsageTurn[] = await scanCopilotUsage({ since: 0 });
  const folds: SessionFold[] = foldTurns(turns);
  const names: Map<string, string> = await sessionNames();

  for (const fold of folds) {
    const name: string | undefined = names.get(fold.sessionId);
    if (name) fold.title = name;
  }

  return folds;
};

// The display name per session directory. Copilot writes the current one to `workspace.yaml` — there
// is no choosing to do, unlike Claude's stream of rewritten titles, because `session.title_changed`
// is ephemeral and never reaches the log.
const sessionNames = async (): Promise<Map<string, string>> => {
  const root: string = copilotSessionStateDir();
  const ids: string[] = await listDirectories(root);

  const entries: (readonly [string, string])[] = (
    await Promise.all(
      ids.map(async (id) => {
        const read: Result<string, ConfigError> = await readTextFile(
          copilotWorkspacePath(join(root, id))
        );
        if (!read.ok) return undefined;

        const parsed: CopilotWorkspace | undefined = parseWorkspaceFile(read.value);
        return parsed?.name ? ([id, parsed.name] as const) : undefined;
      })
    )
  ).filter((entry): entry is readonly [string, string] => entry !== undefined);

  return new Map(entries);
};
