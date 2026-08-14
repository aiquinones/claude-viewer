import { join } from 'node:path';
import { sessionsDir } from '../../config/paths';
import { listFiles, readTextFile } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import { isRunning } from './is-running';
import { SessionFile, parseSessionFile } from './session-schema';

// The Claude Code processes that exist right now. A session file is written at startup and named
// by pid, but a crashed process can't delete its own file and pids get reused, so every one of
// them is checked against the process table before it counts.
export const liveSessions = async (): Promise<SessionFile[]> => {
  const dir: string = sessionsDir();
  const names: string[] = await listFiles(dir);

  const read: (SessionFile | undefined)[] = await Promise.all(
    names.filter((name) => name.endsWith('.json')).map((name) => readSession(join(dir, name)))
  );

  return read.filter((session): session is SessionFile => session !== undefined && isRunning(session.pid));
};

const readSession = async (path: string): Promise<SessionFile | undefined> => {
  const read: Result<string, ConfigError> = await readTextFile(path);
  return read.ok ? parseSessionFile(read.value) : undefined;
};
