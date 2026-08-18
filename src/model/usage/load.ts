// Both CLIs' usage, in one list. The same shape as `sessions/load.ts` and for the same reason: the
// surface asks what this machine has been spending, and which CLI a turn came from is a field on the
// answer rather than a separate question.

import { scanClaudeUsage } from './claude/scan';
import { scanCopilotUsage } from './copilot/scan';
import { pruneUsageCache, UsageCache } from './incremental';
import { UsageTurn } from './types';

interface LoadUsageTurnsArgs {
  // The start of the widest window on offer. Everything older is skipped on the way in and dropped
  // from the cache on the way out, so the cost of leaving the panel open all week is bounded.
  since: number;
  cache: UsageCache;
}

export const loadUsageTurns = async ({
  since,
  cache
}: LoadUsageTurnsArgs): Promise<UsageTurn[]> => {
  const [claude, copilot]: UsageTurn[][] = await Promise.all([
    scanClaudeUsage({ since, cache }),
    scanCopilotUsage({ since })
  ]);

  pruneUsageCache(cache, since);

  return [...claude, ...copilot].filter((turn) => turn.at > since);
};
