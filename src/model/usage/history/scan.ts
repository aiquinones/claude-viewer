// Both CLIs' whole corpus, as one list of sessions. The same shape as `usage/load.ts` and for the
// same reason: which CLI a session ran under is a field on the answer, not a separate question.

import { UsageScope, UsageHistory, SessionUsage } from '../types';
import { scanClaudeHistory, HistoryCache } from './claude';
import { scanCopilotHistory } from './copilot';
import { foldToSession, SessionFold } from './fold';

export type { HistoryCache } from './claude';

export const newHistoryCache = (): HistoryCache => new Map();

interface ScanUsageHistoryArgs {
  cache: HistoryCache;
  now: number;
}

export const scanUsageHistory = async ({
  cache,
  now
}: ScanUsageHistoryArgs): Promise<UsageHistory> => {
  const [claude, copilot]: SessionFold[][] = await Promise.all([
    scanClaudeHistory(cache),
    scanCopilotHistory()
  ]);

  const sessions: SessionUsage[] = [...claude, ...copilot]
    .map(foldToSession)
    // A session that produced no turns has nothing to draw and nothing to search — it's a directory
    // that exists, which the Active Agents surface is the place to see.
    .filter((session) => session.turns > 0)
    .sort((left, right) => right.lastAt - left.lastAt);

  return { sessions, scannedAt: now };
};

interface NarrowHistoryArgs {
  history: UsageHistory;
  scope: UsageScope;
  workspaceRoot: string | undefined;
}

// The scope filter, applied to whole sessions rather than to turns. Same rule as `aggregate.ts` —
// a worktree sits under `<root>/.claude/worktrees/` and counts as this workspace — and applied on
// the host for the same reason the report's is: the setting decides which rows exist, and re-reading
// the disk to answer that is the read the settings channel exists to avoid.
export const narrowHistory = ({
  history,
  scope,
  workspaceRoot
}: NarrowHistoryArgs): UsageHistory => {
  if (scope === 'all') return history;

  return {
    ...history,
    sessions: history.sessions.filter((session) => inScope(session.cwd, workspaceRoot))
  };
};

const inScope = (cwd: string, workspaceRoot: string | undefined): boolean => {
  if (!workspaceRoot) return false;
  return cwd === workspaceRoot || cwd.startsWith(`${workspaceRoot}/`);
};
