// The Codex threads a process is writing to right now.
//
// This is the thinnest liveness signal of the three CLIs, and the reason is that Codex records no
// pid anywhere: not in the lock, not in the four SQLite stores beside it, not in a session file —
// there isn't one. A process takes a thread by creating `<thread-id>.lock` and holding an advisory
// lock on it, so the holder is knowable only through `lsof`, and nothing here spawns a subprocess
// every poll to ask.
//
// So the file's presence is the whole check. Codex removes it on a clean exit — measured: eight
// rollout files on a machine carrying exactly the two locks whose process was alive — but a crash
// removes nothing, and unlike Copilot's `inuse.<pid>.lock` there is no pid to disprove a stale one
// with. A crashed Codex leaves a row that claims to be running.

import { codexLockDir, lockedThreadId } from '../../../config/paths';
import { listFiles } from '../../../config/read';

export const liveCodexThreadIds = async (): Promise<string[]> => {
  const names: string[] = await listFiles(codexLockDir());

  return names
    .map(lockedThreadId)
    .filter((threadId): threadId is string => threadId !== undefined);
};
