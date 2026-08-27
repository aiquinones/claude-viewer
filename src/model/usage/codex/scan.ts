// Codex's side of the usage surface, and the cheapest of the three to read. `~/.codex` keeps one
// index for the machine — the `threads` table, which names each thread's rollout file — so the scan
// is one query plus an appended read per log, with no directory walk and nothing to join.
//
// The numbers are per request and self-contained: `event_msg/token_count` carries a
// `last_token_usage` for the request just made. That is what lets this use the same incremental
// cache Claude's scan does, where Copilot's cannot — a checkpoint's cost there is running state over
// the whole file.
//
// The arithmetic is Copilot's convention rather than Claude's: `input_tokens` is the whole prompt
// and `cached_input_tokens` is a breakdown of it. `toTokens` converts to the disjoint convention
// `UsageTokens` documents, so everything downstream that adds the input counters up stays right.

import { CodexThread, readAllCodexThreads } from '../../sessions/codex/threads-db';
import { readNewTurns, UsageCache } from '../incremental';
import { UsageTokens, UsageTurn } from '../types';
import { CodexTokenUsage, CodexUsageLine, parseCodexUsageLine } from './usage-line';

interface ScanCodexUsageArgs {
  // The start of the widest window. Applied per turn on the way out — a rollout is one file per
  // session and the cache reads only what was appended, so there is no per-file skip to make.
  since: number;
  cache: UsageCache;
}

export const scanCodexUsage = async ({ since, cache }: ScanCodexUsageArgs): Promise<UsageTurn[]> => {
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

  return perThread.flat().filter((turn) => turn.at > since);
};

interface ParseCodexTurnsArgs {
  lines: string[];
  thread: CodexThread;
}

// One request per `token_count`. Walked forward rather than matched line by line, because the model
// is on a different line from the counters: `turn_context` announces it and every request after
// runs under it until the next one. A session really does switch — one measured here ran
// `gpt-5.6-terra` and then `gpt-5.6-luna` — so the thread's own `model` column is only ever the
// last one, and stands in only for a chunk that resumes past the `turn_context` it needed.
//
// Exported for the session page, which reads one rollout whole rather than by appended chunks.
export const parseCodexTurns = ({ lines, thread }: ParseCodexTurnsArgs): UsageTurn[] => {
  const turns: UsageTurn[] = [];
  let model: string = thread.model;

  for (const line of lines) {
    const parsed: CodexUsageLine | undefined = parseCodexUsageLine(line);
    if (!parsed) continue;

    if (parsed.type === TURN_CONTEXT) {
      model = parsed.payload?.model ?? model;
      continue;
    }

    const turn: UsageTurn | undefined = toTurn({ line: parsed, thread, model });
    if (turn) turns.push(turn);
  }

  return turns;
};

// The line naming the model for the requests after it. A stream of its own rather than an
// `event_msg`, which is why this matches on `type` and the counters match on the pair.
const TURN_CONTEXT: string = 'turn_context';

const TOKEN_COUNT: string = 'token_count';

interface ToTurnArgs {
  line: CodexUsageLine;
  thread: CodexThread;
  model: string;
}

const toTurn = ({ line, thread, model }: ToTurnArgs): UsageTurn | undefined => {
  if (line.payload?.type !== TOKEN_COUNT) return undefined;

  const usage: CodexTokenUsage | undefined = line.payload.info?.last_token_usage;
  const at: number = Date.parse(line.timestamp ?? '');
  if (!usage || Number.isNaN(at)) return undefined;

  return {
    id: turnId({ line, threadId: thread.threadId }),
    at,
    tool: 'codex',
    // The *thread* id, which is the id every other Codex surface uses — the lock's filename, the
    // row on Active Agents, a deep link. Deliberately not `session_meta.session_id`: a sub-agent's
    // rollout carries its **parent's** there, so keying on it would fold a sub-agent's spend into
    // the session that spawned it and leave its own row unreachable.
    sessionId: thread.threadId,
    cwd: thread.cwd,
    ...(thread.branch ? { branch: thread.branch } : {}),
    // No skill, ever. Codex writes no invocation of any kind to its logs — see
    // `session/load.ts` for the whole of what that means.
    source: 'read',
    model,
    tokens: toTokens(usage)
  };
};

interface TurnIdArgs {
  line: CodexUsageLine;
  threadId: string;
}

// Codex mints no request id, so the turn is keyed on its position in the file. `ordinal` is unique
// per line and is what current rollouts carry; older ones have none, and their `token_count`
// timestamps are distinct to the millisecond, which is what stands in.
const turnId = ({ line, threadId }: TurnIdArgs): string =>
  `${threadId}:${line.ordinal ?? line.timestamp ?? ''}`;

// Codex's inclusive counters → the disjoint ones `UsageTokens` is defined in, so the three input
// fields add up to the prompt exactly once. That is what `contextPointsFromTurns` sums, and what
// keeps this side needing no branch there.
//
// The cache write has no TTL — Codex states none and nothing prices a Codex turn — so it rides the
// 5-minute field as a container rather than as a claim about which rate would apply.
const toTokens = (usage: CodexTokenUsage): UsageTokens => {
  const prompt: number = usage.input_tokens ?? 0;
  const cacheRead: number = usage.cached_input_tokens ?? 0;
  const cacheWrite: number = usage.cache_write_input_tokens ?? 0;

  return {
    input: Math.max(prompt - cacheRead - cacheWrite, 0),
    output: usage.output_tokens ?? 0,
    cacheRead,
    cacheWrite5m: cacheWrite,
    cacheWrite1h: 0
  };
};
