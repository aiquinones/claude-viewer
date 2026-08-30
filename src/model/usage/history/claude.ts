// Claude's side of the history: every transcript under `~/.claude/projects`, folded to one record
// per session. Unlike the windowed scan nothing is skipped on its mtime — a grid is about the months
// a mtime filter exists to avoid reading. The cold pass over 87 transcripts (76MB) measured 226ms,
// and every pass after it reads only what was appended.

import { join } from 'node:path';
import { AppendedLines, listDirectories, listFiles, readAppendedLines } from '../../../config/read';
import { projectsDir } from '../../../config/paths';
import { parseTranscriptLine, TranscriptLine } from '../../sessions/claude/transcript-schema';
import { parseClaudeTurns } from '../claude/scan';
import { addTurn, emptyFold, SessionFold } from './fold';

const TRANSCRIPT_SUFFIX: string = '.jsonl';

// How many turn ids are carried across a chunk boundary to dedupe against. One request writes
// several transcript lines carrying the same usage, and 4,750 of the 10,543 assistant lines here are
// such a repeat — but the gap between a line and its duplicate is *always* one, measured over the
// whole corpus. A handful is margin; keeping every id would grow the cache with the corpus, which
// is the one thing this fold exists to avoid.
const DEDUPE_WINDOW: number = 8;

// One transcript, part-read. The fold is the accumulator the turns are thrown away into.
interface FileHistory {
  offset: number;
  // Whether the first `ai-title` has been looked for and found. The title is near the head, so once
  // it's here no later chunk can change it.
  title?: string;
  folds: Map<string, SessionFold>;
  recentIds: string[];
}

export type ClaudeHistoryCache = Map<string, FileHistory>;

// Files read at once. The windowed scan gets away with `Promise.all` over everything because its
// mtime filter drops most of the corpus; reading all of it that way peaked at ~300MB resident.
const FILE_CONCURRENCY: number = 6;

export const scanClaudeHistory = async (cache: ClaudeHistoryCache): Promise<SessionFold[]> => {
  const root: string = projectsDir();
  const dirs: string[] = await listDirectories(root);

  const paths: string[] = (
    await Promise.all(
      dirs.map(async (dir) => {
        const names: string[] = await listFiles(join(root, dir));
        return names
          .filter((name) => name.endsWith(TRANSCRIPT_SUFFIX))
          .map((name) => join(root, dir, name));
      })
    )
  ).flat();

  await inBatches(paths, (path) => scanFile({ path, cache }));

  // Every fold the cache holds, whichever pass filled it. A file that yielded nothing this time
  // still contributes what it yielded before.
  return [...cache.values()].flatMap((held) => [...held.folds.values()]);
};

// Which transcripts hold a given session, out of what the history scan has already read. A lookup
// rather than a search — the cache is keyed by path and each entry knows its own sessions — and it
// returns a list because a resumed session's turns can be spread across two files.
export const pathsForSession = (cache: ClaudeHistoryCache, sessionId: string): string[] =>
  [...cache.entries()].filter(([, held]) => held.folds.has(sessionId)).map(([path]) => path);

interface ScanFileArgs {
  path: string;
  cache: ClaudeHistoryCache;
}

const scanFile = async ({ path, cache }: ScanFileArgs): Promise<void> => {
  const held: FileHistory = cache.get(path) ?? { offset: 0, folds: new Map(), recentIds: [] };

  const read: AppendedLines | undefined = await readAppendedLines({ path, offset: held.offset });

  if (!read) {
    cache.delete(path);
    return;
  }

  // Replaced rather than appended to, so everything folded out of the old file is about a file that
  // no longer exists.
  const from: FileHistory = read.rewound
    ? { offset: 0, folds: new Map(), recentIds: [] }
    : { ...held };

  from.offset = read.offset;
  if (read.lines.length === 0) {
    cache.set(path, from);
    return;
  }

  from.title = from.title ?? firstTitle(read.lines);

  for (const turn of parseClaudeTurns(read.lines)) {
    if (from.recentIds.includes(turn.id)) continue;
    from.recentIds.push(turn.id);
    if (from.recentIds.length > DEDUPE_WINDOW) from.recentIds.shift();

    const fold: SessionFold | undefined = from.folds.get(turn.sessionId);
    if (fold) addTurn(fold, turn);
    else {
      const next: SessionFold = emptyFold(turn);
      addTurn(next, turn);
      from.folds.set(turn.sessionId, next);
    }
  }

  // The title arrives near the head of the file and the folds it belongs to are keyed by session, so
  // it's stamped on all of them — a transcript holding turns from two sessions is a resume, and the
  // name the file was given is the name of both.
  for (const fold of from.folds.values()) fold.title = fold.title ?? from.title;

  cache.set(path, from);
};

// The *first* `ai-title` in the file. Claude Code rewrites it as the session goes on and the later
// ones chase whatever the newest turn was about — same rule `sessions/claude/transcript.ts` follows,
// and free here because the head of the file was read anyway.
const firstTitle = (lines: string[]): string | undefined => {
  for (const line of lines) {
    if (!line.includes('ai-title')) continue;
    const parsed: TranscriptLine | undefined = parseTranscriptLine(line);
    if (parsed?.type === 'ai-title' && parsed.aiTitle) return parsed.aiTitle;
  }
  return undefined;
};

// Bounded fan-out. `Promise.all` over the whole corpus holds every file's text in memory at once,
// which is the difference between a scan that costs 300MB and one that costs a few dozen.
const inBatches = async <Item>(
  items: Item[],
  run: (item: Item) => Promise<void>
): Promise<void> => {
  for (let start = 0; start < items.length; start += FILE_CONCURRENCY) {
    await Promise.all(items.slice(start, start + FILE_CONCURRENCY).map(run));
  }
};
