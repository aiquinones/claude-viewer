// The PR a Copilot session opened. Claude Code writes a `pr-link` line for this and repeats it
// every few thousand lines, so its reader finds one in a 64KB tail. Copilot writes nothing of the
// kind: the URL appears once, in the output of the command that opened it — 313KB from the end of
// a session measured here, well outside the 256KB tail `events.ts` reads. So this walks the whole
// log, and holds an offset so it only ever walks it once.

import { AppendedLines, readAppendedLines } from '../../../config/read';
import { AgentPullRequest } from '../../types';
import { CopilotEvent, parseEvent } from './event-schema';

// A PR URL alone on its own line, which is exactly what `gh pr create` prints and nothing else in a
// log looks like. Matched against a tool's *output* rather than the whole line, so a link the model
// wrote in a message or the user pasted into a prompt isn't one.
const PR_URL_LINE: RegExp = /^\s*(https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/(\d+))\s*$/;

// Cheap enough to run over every line of a megabyte log. Only the handful that survive it are worth
// parsing — one `system.message` in these files is 77KB of JSON.
const URL_HINT: string = '/pull/';

export interface CopilotPrScan {
  // Byte offset just past the last whole line read. What makes the next pass cost nothing.
  offset: number;
  pullRequest?: AgentPullRequest;
}

// Keyed by event-log path. Owned by the caller, the way `UsageCache` is — nothing in `model/` holds
// state of its own.
export type CopilotPrCache = Map<string, CopilotPrScan>;

export const newCopilotPrCache = (): CopilotPrCache => new Map();

interface ReadCopilotPullRequestArgs {
  path: string;
  cache: CopilotPrCache;
}

// The PR this session has opened so far, from the bytes appended since the last pass. A session can
// open a second one, so a later link replaces an earlier one — the rule Claude's reader follows.
export const readCopilotPullRequest = async ({
  path,
  cache
}: ReadCopilotPullRequestArgs): Promise<AgentPullRequest | undefined> => {
  const held: CopilotPrScan = cache.get(path) ?? { offset: 0 };

  const read: AppendedLines | undefined = await readAppendedLines({ path, offset: held.offset });

  if (!read) {
    cache.delete(path);
    return undefined;
  }

  // Shorter than the offset means the file was replaced rather than appended to, so what was found
  // in the old one is about a log that no longer exists.
  const before: AgentPullRequest | undefined = read.rewound ? undefined : held.pullRequest;
  const found: AgentPullRequest | undefined = lastPullRequest(read.lines) ?? before;

  cache.set(path, { offset: read.offset, pullRequest: found });
  return found;
};

// Drops the logs that aren't live any more, so the cache is bounded by what's running rather than by
// how long the panel has been open.
export const pruneCopilotPrCache = (cache: CopilotPrCache, paths: readonly string[]): void => {
  const live: Set<string> = new Set(paths);
  for (const path of cache.keys()) {
    if (!live.has(path)) cache.delete(path);
  }
};

const lastPullRequest = (lines: readonly string[]): AgentPullRequest | undefined => {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line: string = lines[index];
    if (!line.includes(URL_HINT)) continue;

    const event: CopilotEvent | undefined = parseEvent(line);
    if (event?.type !== 'tool.execution_complete') continue;

    const found: AgentPullRequest | undefined = pullRequestIn(event.data?.result?.content);
    if (found) return found;
  }
  return undefined;
};

// The last PR URL standing alone in one tool's output. Last rather than first: a chained command
// prints its push output first and the link the PR was opened at comes after it.
const pullRequestIn = (content: string | undefined): AgentPullRequest | undefined => {
  if (!content) return undefined;

  const lines: string[] = content.split('\n');

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const matched: RegExpMatchArray | null = lines[index].match(PR_URL_LINE);
    if (matched) return { number: Number(matched[2]), url: matched[1] };
  }
  return undefined;
};
