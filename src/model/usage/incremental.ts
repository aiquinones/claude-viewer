// Reading one append-only log again, cheaply. A transcript only ever grows, so a pass that already
// read the first 40MB of one should read the bytes since and nothing else.
//
// The cache holds the turns as well as the offset, because that's what makes the offset usable: the
// caller gets the whole file's turns back every time without the file being re-parsed.

import { FileSince, readFileSince } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import { UsageTurn } from './types';

// Ceiling on one pass over one file. A log that grew by more than this is finished on the next pass
// rather than pulled into memory whole.
const MAX_CHUNK_BYTES: number = 8 * 1024 * 1024;

export interface FileUsage {
  // Byte offset just past the last whole line consumed. Always a line boundary, which is why the
  // next read never starts mid-line and nothing has to be dropped at the front.
  offset: number;
  turns: UsageTurn[];
}

export type UsageCache = Map<string, FileUsage>;

interface ReadNewTurnsArgs {
  path: string;
  cache: UsageCache;
  // Whole lines → turns. Only ever handed the lines appended since the last pass.
  parse: (lines: string[]) => UsageTurn[];
}

// Every turn this file has yielded so far, the appended ones included. An unreadable file drops out
// of the cache and returns nothing — a session directory can be deleted while the panel is open.
export const readNewTurns = async ({
  path,
  cache,
  parse
}: ReadNewTurnsArgs): Promise<UsageTurn[]> => {
  const held: FileUsage = cache.get(path) ?? { offset: 0, turns: [] };

  const read: Result<FileSince, ConfigError> = await readFileSince({
    path,
    offset: held.offset,
    maxBytes: MAX_CHUNK_BYTES
  });

  if (!read.ok) {
    cache.delete(path);
    return [];
  }

  // Shorter than the offset means the file was replaced rather than appended to, so everything read
  // out of the old one is about a file that no longer exists.
  const from: FileUsage = read.value.rewound ? { offset: 0, turns: [] } : held;

  // The file is being appended to while it's read, so the last line in the window is often half a
  // line. Consuming up to the final newline leaves it for the next pass, whole.
  const end: number = read.value.text.lastIndexOf('\n');
  if (end < 0) {
    cache.set(path, from);
    return from.turns;
  }

  const consumed: string = read.value.text.slice(0, end + 1);
  const turns: UsageTurn[] = [...from.turns];
  const seen: Set<string> = new Set(turns.map((turn) => turn.id));

  for (const turn of parse(consumed.split('\n'))) {
    if (seen.has(turn.id)) continue;
    seen.add(turn.id);
    turns.push(turn);
  }

  cache.set(path, {
    offset: from.offset + Buffer.byteLength(consumed, 'utf8'),
    turns
  });
  return turns;
};

// Drops what's fallen out of the widest window, so the cache is bounded by the window rather than by
// how long the panel has been open. The offsets stay — those turns are behind them and gone for good.
export const pruneUsageCache = (cache: UsageCache, since: number): void => {
  for (const [path, held] of cache) {
    const kept: UsageTurn[] = held.turns.filter((turn) => turn.at > since);
    if (kept.length !== held.turns.length) cache.set(path, { ...held, turns: kept });
  }
};
