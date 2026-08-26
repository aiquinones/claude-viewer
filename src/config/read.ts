import { Dirent, Stats, promises as fs } from 'node:fs';
import { FileHandle } from 'node:fs/promises';
import { join } from 'node:path';
import { Result, ConfigError, ok, err } from './result';

// Reads a UTF-8 file. A missing file is a normal outcome here, not a failure to shout about.
export const readTextFile = async (path: string): Promise<Result<string, ConfigError>> => {
  try {
    return ok(await fs.readFile(path, 'utf8'));
  } catch (caught) {
    const code: string | undefined = (caught as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return err({ kind: 'not-found', path, message: 'file does not exist' });
    }
    return err({
      kind: 'unreadable',
      path,
      message: String((caught as Error).message ?? caught)
    });
  }
};

export interface FileTail {
  text: string;
  // Milliseconds since the epoch. The reader shows an age, and computes it against its own clock
  // rather than the one this was read on.
  mtimeMs: number;
  // The read started past byte zero, so the first line in `text` is half a line.
  truncated: boolean;
}

interface ReadFileTailArgs {
  path: string;
  maxBytes: number;
}

// The end of a file, and when it was last written. Transcripts reach megabytes and everything a
// session row needs is at the bottom of one, so nothing reads the whole thing.
export const readFileTail = async ({
  path,
  maxBytes
}: ReadFileTailArgs): Promise<Result<FileTail, ConfigError>> => {
  let handle: FileHandle | undefined;
  try {
    handle = await fs.open(path, 'r');
    const stats: Stats = await handle.stat();
    const start: number = Math.max(0, stats.size - maxBytes);
    const buffer: Buffer = Buffer.alloc(Math.min(stats.size, maxBytes));
    await handle.read(buffer, 0, buffer.length, start);

    return ok({ text: buffer.toString('utf8'), mtimeMs: stats.mtimeMs, truncated: start > 0 });
  } catch (caught) {
    const code: string | undefined = (caught as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return err({ kind: 'not-found', path, message: 'file does not exist' });
    }
    return err({ kind: 'unreadable', path, message: String((caught as Error).message ?? caught) });
  } finally {
    await handle?.close();
  }
};

export interface FileSince {
  text: string;
  // Where the file ends now. A caller that consumed whole lines stores its own smaller offset.
  size: number;
  mtimeMs: number;
  // The file is shorter than the offset asked for, so it was replaced rather than appended to and
  // the caller's cached work for it is stale.
  rewound: boolean;
}

interface ReadFileSinceArgs {
  path: string;
  // Byte offset to read from. 0 reads the whole file.
  offset: number;
  // Ceiling on one read, so a file that grew by a lot between passes can't be pulled into memory
  // whole. The caller reads again from the new offset.
  maxBytes: number;
}

// Everything appended since `offset`. Transcripts and event logs only ever grow, so re-reading one
// from the top on every poll is the whole cost this avoids.
export const readFileSince = async ({
  path,
  offset,
  maxBytes
}: ReadFileSinceArgs): Promise<Result<FileSince, ConfigError>> => {
  let handle: FileHandle | undefined;
  try {
    handle = await fs.open(path, 'r');
    const stats: Stats = await handle.stat();

    const rewound: boolean = stats.size < offset;
    const start: number = rewound ? 0 : offset;
    const length: number = Math.min(stats.size - start, maxBytes);

    if (length <= 0) {
      return ok({ text: '', size: stats.size, mtimeMs: stats.mtimeMs, rewound });
    }

    const buffer: Buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, start);

    return ok({
      text: buffer.toString('utf8'),
      size: start + length,
      mtimeMs: stats.mtimeMs,
      rewound
    });
  } catch (caught) {
    const code: string | undefined = (caught as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return err({ kind: 'not-found', path, message: 'file does not exist' });
    }
    return err({ kind: 'unreadable', path, message: String((caught as Error).message ?? caught) });
  } finally {
    await handle?.close();
  }
};

// Ceiling on one pass over one file. A log that grew by more than this is finished on the next pass
// rather than pulled into memory whole.
const MAX_CHUNK_BYTES: number = 8 * 1024 * 1024;

export interface AppendedLines {
  // Whole lines only. The half line at the end of the window is left for the next pass.
  lines: string[];
  // Byte offset just past the last one, to hand back on the next read.
  offset: number;
  // The file is shorter than the offset asked for, so it was replaced rather than appended to and
  // whatever the caller accumulated from the old one describes a file that no longer exists.
  rewound: boolean;
}

interface ReadAppendedLinesArgs {
  path: string;
  offset: number;
}

// The bytes since `offset`, cut into whole lines. Every reader over these logs needs exactly this
// and differs only in what it keeps — usage turns, a per-session fold, the PR a Copilot session
// opened. Undefined means the file couldn't be read at all; a session directory can be deleted
// while the panel is open.
export const readAppendedLines = async ({
  path,
  offset
}: ReadAppendedLinesArgs): Promise<AppendedLines | undefined> => {
  const read: Result<FileSince, ConfigError> = await readFileSince({
    path,
    offset,
    maxBytes: MAX_CHUNK_BYTES
  });

  if (!read.ok) return undefined;

  const from: number = read.value.rewound ? 0 : offset;

  // The file is being appended to while it's read, so the last line in the window is often half a
  // line. Consuming up to the final newline leaves it for the next pass, whole.
  const end: number = read.value.text.lastIndexOf('\n');
  if (end < 0) return { lines: [], offset: from, rewound: read.value.rewound };

  const consumed: string = read.value.text.slice(0, end + 1);

  return {
    lines: consumed.split('\n'),
    offset: from + Buffer.byteLength(consumed, 'utf8'),
    rewound: read.value.rewound
  };
};

export interface FileHead {
  text: string;
  // The whole file fit in the window, so the last line is a whole line.
  atEnd: boolean;
}

interface ReadFileHeadArgs {
  path: string;
  maxBytes: number;
}

// The start of a file. The caller decides how much is enough and asks again with a bigger window,
// which is cheaper than reading a megabyte to find something that's usually 20KB in.
export const readFileHead = async ({
  path,
  maxBytes
}: ReadFileHeadArgs): Promise<Result<FileHead, ConfigError>> => {
  let handle: FileHandle | undefined;
  try {
    handle = await fs.open(path, 'r');
    const buffer: Buffer = Buffer.alloc(maxBytes);
    const { bytesRead } = await handle.read(buffer, 0, maxBytes, 0);

    return ok({ text: buffer.toString('utf8', 0, bytesRead), atEnd: bytesRead < maxBytes });
  } catch (caught) {
    const code: string | undefined = (caught as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return err({ kind: 'not-found', path, message: 'file does not exist' });
    }
    return err({ kind: 'unreadable', path, message: String((caught as Error).message ?? caught) });
  } finally {
    await handle?.close();
  }
};

export interface FileStats {
  size: number;
  mtimeMs: number;
}

// Size and last-write time, without opening the file. Undefined for anything that can't be stat'd,
// which callers read as "skip this one" — a file that vanished between the listing and here is a
// normal outcome when the thing writing it is a live agent.
export const fileStats = async (path: string): Promise<FileStats | undefined> => {
  try {
    const stats: Stats = await fs.stat(path);
    return { size: stats.size, mtimeMs: stats.mtimeMs };
  } catch {
    return undefined;
  }
};

// Names of the files directly in `dir`, no recursion. Missing reads as empty, like the directory
// listing below it.
export const listFiles = async (dir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return [];
  }
};

// Names of the subdirectories of `dir`. A missing or unreadable directory reads as empty —
// callers are scanning optional config locations, and "not there" is the common case.
export const listDirectories = async (dir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
};

interface FindFilesNamedArgs {
  dir: string;
  fileName: string;
  // Directory names to never descend into.
  skip: readonly string[];
  // How many levels below `dir` to walk. 0 looks in `dir` only.
  maxDepth: number;
}

// Every `<dir>/**/<fileName>`, as absolute paths. A walk rather than a glob so the skip list and
// the depth cap are enforced before a directory is opened, not after.
export const findFilesNamed = async ({
  dir,
  fileName,
  skip,
  maxDepth
}: FindFilesNamedArgs): Promise<string[]> => {
  if (maxDepth < 0) return [];

  let entries: Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const here: string[] = entries
    .filter((entry) => entry.isFile() && entry.name === fileName)
    .map((entry) => join(dir, entry.name));

  const below: string[][] = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !skip.includes(entry.name))
      .map((entry) =>
        findFilesNamed({ dir: join(dir, entry.name), fileName, skip, maxDepth: maxDepth - 1 })
      )
  );

  return [...here, ...below.flat()];
};

// Counts files under `dir`, recursively. Used for the bundled references/ and scripts/ badges.
export const countFiles = async (dir: string): Promise<number> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const counts: number[] = await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory() ? countFiles(`${dir}/${entry.name}`) : 1
      )
    );
    return counts.reduce((total: number, count: number) => total + count, 0);
  } catch {
    return 0;
  }
};
