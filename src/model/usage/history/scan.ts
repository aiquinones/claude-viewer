// Every CLI's whole corpus, as one list of sessions. The same shape as `usage/load.ts` and for the
// same reason: which CLI a session ran under is a field on the answer, not a separate question.

import { loadRetention } from '../../retention/load';
import { Retention } from '../../retention/types';
import { UsageCache } from '../incremental';
import { UsageScope, UsageHistory, SessionUsage } from '../types';
import { scanClaudeHistory, ClaudeHistoryCache } from './claude';
import { scanCodexHistory } from './codex';
import { scanCopilotHistory } from './copilot';
import { foldToSession, SessionFold } from './fold';

export type { ClaudeHistoryCache } from './claude';

// What a pass resumes from, per CLI. Two shapes rather than one: Claude's folds as it reads and
// keeps four numbers per session, where Codex keeps its turns — the corpora are different sizes and
// the two scans made different trades. Copilot has no entry because it re-reads its logs whole.
export interface HistoryCache {
  claude: ClaudeHistoryCache;
  codex: UsageCache;
}

export const newHistoryCache = (): HistoryCache => ({ claude: new Map(), codex: new Map() });

interface ScanUsageHistoryArgs {
  cache: HistoryCache;
  now: number;
  // Which settings layers to look in for `cleanupPeriodDays`. The project ones only exist when a
  // folder is open, the same as everywhere else here.
  workspaceRoot: string | undefined;
}

export const scanUsageHistory = async ({
  cache,
  now,
  workspaceRoot
}: ScanUsageHistoryArgs): Promise<UsageHistory> => {
  const [claude, codex, copilot, retention]: [
    SessionFold[],
    SessionFold[],
    SessionFold[],
    Retention
  ] = await Promise.all([
    scanClaudeHistory(cache.claude),
    scanCodexHistory(cache.codex),
    scanCopilotHistory(),
    loadRetention(workspaceRoot)
  ]);

  const sessions: SessionUsage[] = [...claude, ...codex, ...copilot]
    .map(foldToSession)
    // A session that produced no turns has nothing to draw and nothing to search — it's a directory
    // that exists, which the Active Agents surface is the place to see.
    .filter((session) => session.turns > 0)
    .sort((left, right) => right.lastAt - left.lastAt);

  return { sessions, retention, scannedAt: now };
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
