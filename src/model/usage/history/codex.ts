// Codex's side of the history: every rollout the `threads` table names, folded to one record per
// thread. Its own cache rather than the windowed scan's, for the reason Claude's history keeps one —
// that cache is pruned to the widest window on every pass, and a grid is about the months the prune
// throws away.
//
// Incremental, unlike Copilot's history, which re-reads every log whole because a checkpoint's cost
// can't be resumed from an offset. Codex's counters are per line, so an offset is all this needs —
// which matters more here than the current corpus suggests: one rollout inlines its reasoning and
// its system prompts and runs to a megabyte.

import { readAllCodexThreads, CodexThread, threadTitle } from '../../sessions/codex/threads-db';
import { parseCodexTurns } from '../codex/scan';
import { readNewTurns, UsageCache } from '../incremental';
import { UsageTurn } from '../types';
import { foldTurns, SessionFold } from './fold';

export const scanCodexHistory = async (cache: UsageCache): Promise<SessionFold[]> => {
  const threads: Map<string, CodexThread> = await readAllCodexThreads();

  const perThread: UsageTurn[][] = await Promise.all(
    [...threads.values()].map((thread) =>
      readNewTurns({
        path: thread.rolloutPath,
        cache,
        parse: (lines: string[]) => parseCodexTurns({ lines, thread })
      })
    )
  );

  const folds: SessionFold[] = foldTurns(perThread.flat());

  for (const fold of folds) {
    const thread: CodexThread | undefined = threads.get(fold.sessionId);
    const title: string | undefined = thread ? threadTitle(thread) : undefined;
    if (title) fold.title = title;
  }

  return folds;
};
