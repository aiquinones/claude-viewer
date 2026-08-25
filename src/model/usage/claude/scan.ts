// Claude Code's side of the usage surface: every `assistant` line under `~/.claude/projects`, with
// the skill it was stamped with. Nothing here infers anything — `attributionSkill` is on the line.

import { join } from 'node:path';
import { FileStats, fileStats, listDirectories, listFiles } from '../../../config/read';
import { projectsDir } from '../../../config/paths';
import { readNewTurns, UsageCache } from '../incremental';
import { UsageTokens, UsageTurn } from '../types';
import { parseUsageLine, UsageLine } from './usage-schema';

const TRANSCRIPT_SUFFIX: string = '.jsonl';

// The model on a line the CLI wrote itself rather than asked for — "You've hit your session limit",
// an expired OAuth token. They're `assistant` lines with a requestId and an all-zero usage block, so
// nothing else tells them apart from a request that happened to be cheap. Counting them adds
// requests that were never made and puts `<synthetic>` in the list of models with no price.
const SYNTHETIC_MODEL: string = '<synthetic>';

interface ScanClaudeUsageArgs {
  // The start of the widest window. A file last written before it cannot hold a turn inside it.
  since: number;
  cache: UsageCache;
}

// One directory per working directory, each holding that directory's transcripts. Read in parallel:
// this is dozens of files and the whole point is that it stays cheap enough to poll.
export const scanClaudeUsage = async ({
  since,
  cache
}: ScanClaudeUsageArgs): Promise<UsageTurn[]> => {
  const root: string = projectsDir();
  const dirs: string[] = await listDirectories(root);

  const perDir: UsageTurn[][] = await Promise.all(
    dirs.map((dir) => scanDir({ dir: join(root, dir), since, cache }))
  );

  return perDir.flat();
};

interface ScanDirArgs {
  dir: string;
  since: number;
  cache: UsageCache;
}

const scanDir = async ({ dir, since, cache }: ScanDirArgs): Promise<UsageTurn[]> => {
  const names: string[] = (await listFiles(dir)).filter((name) => name.endsWith(TRANSCRIPT_SUFFIX));

  const perFile: UsageTurn[][] = await Promise.all(
    names.map((name) => scanFile({ path: join(dir, name), since, cache }))
  );

  return perFile.flat();
};

interface ScanFileArgs {
  path: string;
  since: number;
  cache: UsageCache;
}

// Most of the corpus is months old and can't contribute to a seven-day window. Skipping those on
// their mtime is what keeps a full scan down to the files that have actually been written to lately
// — 26 of 59 here, and the 33 skipped are most of the bytes.
const scanFile = async ({ path, since, cache }: ScanFileArgs): Promise<UsageTurn[]> => {
  const stats: FileStats | undefined = await fileStats(path);
  if (!stats) return [];
  if (stats.mtimeMs < since && !cache.has(path)) return [];

  return readNewTurns({ path, cache, parse: parseClaudeTurns });
};

// Exported for the history scan, which reads the same lines and keeps a per-session fold instead of
// the turns. What counts as a turn has to be the one rule, or the two tabs disagree on a total.
//
// One request per turn, not one line: an assistant reply carrying a thinking block and two tool
// calls is written as three lines, and every one of them repeats the *whole* request's usage. Left
// alone that bills a session two or three times over. The callers that fold turns over a moving
// window still keep their own dedupe — theirs is for a request split across two reads of the file,
// which nothing local to one batch of lines can see.
export const parseClaudeTurns = (lines: string[]): UsageTurn[] => {
  const turns: UsageTurn[] = [];
  const seen: Set<string> = new Set();

  for (const line of lines) {
    const parsed: UsageLine | undefined = parseUsageLine(line);
    if (!parsed) continue;

    const turn: UsageTurn | undefined = toTurn(parsed);
    if (!turn || seen.has(turn.id)) continue;

    seen.add(turn.id);
    turns.push(turn);
  }

  return turns;
};

// A line missing any of the four fields a turn is keyed on isn't a turn worth counting — it can't be
// deduped, placed in a window, or attributed to a workspace.
const toTurn = (line: UsageLine): UsageTurn | undefined => {
  const at: number = Date.parse(line.timestamp ?? '');
  if (!line.requestId || !line.sessionId || !line.cwd || Number.isNaN(at)) return undefined;
  if (line.message?.model === SYNTHETIC_MODEL) return undefined;

  return {
    id: line.requestId,
    at,
    tool: 'claude',
    sessionId: line.sessionId,
    cwd: line.cwd,
    ...(line.gitBranch ? { branch: line.gitBranch } : {}),
    ...(line.attributionSkill ? { skill: line.attributionSkill } : {}),
    source: 'read',
    model: line.message?.model ?? '',
    tokens: tokensOf(line)
  };
};

const tokensOf = (line: UsageLine): UsageTokens => {
  const usage = line.message?.usage;
  const split = usage?.cache_creation;

  // The split is authoritative when it's there. When it isn't, the flat total is a 5-minute write:
  // that's the CLI's default TTL, and pricing it as the 1-hour one would overcharge by 60%.
  const write1h: number = split?.ephemeral_1h_input_tokens ?? 0;
  const write5m: number = split
    ? (split.ephemeral_5m_input_tokens ?? 0)
    : (usage?.cache_creation_input_tokens ?? 0);

  return {
    input: usage?.input_tokens ?? 0,
    output: usage?.output_tokens ?? 0,
    cacheRead: usage?.cache_read_input_tokens ?? 0,
    cacheWrite5m: write5m,
    cacheWrite1h: write1h
  };
};
