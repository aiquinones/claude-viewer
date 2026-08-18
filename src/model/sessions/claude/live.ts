import { join } from 'node:path';
import { sessionsDir } from '../../../config/paths';
import { listFiles, readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { isRunning } from '../is-running';
import { SessionFile, parseSessionFile } from './session-schema';

// The Claude Code sessions running right now. A session file is written at startup and named
// by pid, but a crashed process can't delete its own file and pids get reused, so every one of
// them is checked against the process table before it counts.
export const liveSessions = async (): Promise<SessionFile[]> => {
  const dir: string = sessionsDir();
  const names: string[] = await listFiles(dir);

  const read: (SessionFile | undefined)[] = await Promise.all(
    names.filter((name) => name.endsWith('.json')).map((name) => readSession(join(dir, name)))
  );

  const live: SessionFile[] = read.filter(
    (session): session is SessionFile => session !== undefined && isRunning(session.pid)
  );

  return newestPerSession(live);
};

const readSession = async (path: string): Promise<SessionFile | undefined> => {
  const read: Result<string, ConfigError> = await readTextFile(path);
  return read.ok ? parseSessionFile(read.value) : undefined;
};

// One entry per conversation, not per process. `--resume` starts a second process on an existing
// sessionId and the first can outlive it, so two live files name the same transcript — and every
// field a row shows is read from that transcript, so they'd render as the same row twice. This is
// the rule copilot/live.ts gets for free: its layout is one directory per session, Claude's is one
// file per pid.
const newestPerSession = (sessions: SessionFile[]): SessionFile[] => {
  const newest: Map<string, SessionFile> = new Map();

  for (const session of sessions) {
    const held: SessionFile | undefined = newest.get(session.sessionId);
    if (!held || isNewer(session, held)) newest.set(session.sessionId, session);
  }

  return [...newest.values()];
};

// The process currently attached to the conversation; the other is the leftover that failed to
// exit. Both files carry `startedAt`, and pid breaks the tie only if one of them doesn't.
const isNewer = (candidate: SessionFile, held: SessionFile): boolean => {
  const candidateStart: number = candidate.startedAt ?? 0;
  const heldStart: number = held.startedAt ?? 0;

  if (candidateStart !== heldStart) return candidateStart > heldStart;
  return candidate.pid > held.pid;
};
