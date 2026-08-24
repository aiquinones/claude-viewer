import { join } from 'node:path';
import {
  copilotSessionStateDir,
  copilotWorkspacePath,
  lockedPid
} from '../../../config/paths';
import { listDirectories, listFiles, readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { isRunning } from '../is-running';
import { CopilotWorkspace, parseWorkspaceFile } from './workspace-schema';

export interface LiveCopilotSession {
  sessionId: string;
  pid: number;
  // The other processes holding the same directory. A resumed session is a second process and a
  // crash leaves a lock behind, so more than one live pid on one session is a real state.
  otherPids: number[];
  dir: string;
  workspace: CopilotWorkspace;
}

// The Copilot CLI processes that exist right now. A process takes a session by writing
// `inuse.<pid>.lock` into its directory and removes the file when it exits cleanly — one signal more
// than Claude gives — but a crash removes nothing, so every pid still goes through the process
// table before it counts.
export const liveCopilotSessions = async (): Promise<LiveCopilotSession[]> => {
  const root: string = copilotSessionStateDir();
  const ids: string[] = await listDirectories(root);

  const read: (LiveCopilotSession | undefined)[] = await Promise.all(
    ids.map((id) => readSession({ root, sessionId: id }))
  );

  return read.filter((session): session is LiveCopilotSession => session !== undefined);
};

interface ReadSessionArgs {
  root: string;
  sessionId: string;
}

const readSession = async ({
  root,
  sessionId
}: ReadSessionArgs): Promise<LiveCopilotSession | undefined> => {
  const dir: string = join(root, sessionId);

  const pids: number[] = await holdingPids(dir);
  if (pids.length === 0) return undefined;

  const [pid, ...otherPids]: number[] = pids;

  const read: Result<string, ConfigError> = await readTextFile(copilotWorkspacePath(dir));
  if (!read.ok) return undefined;

  const workspace: CopilotWorkspace | undefined = parseWorkspaceFile(read.value);
  if (!workspace) return undefined;

  return { sessionId, pid, otherPids, dir, workspace };
};

// Every pid still holding this session. A directory can carry more than one lock — a resumed
// session is a second process — so the first live one holds the row and the rest ride beside it.
// Locks whose process is gone are ignored: a crash removes nothing.
const holdingPids = async (dir: string): Promise<number[]> => {
  const names: string[] = await listFiles(dir);

  return names
    .map(lockedPid)
    .filter((pid): pid is number => pid !== undefined && isRunning(pid));
};
