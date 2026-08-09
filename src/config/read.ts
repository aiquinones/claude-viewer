import { Dirent, promises as fs } from 'node:fs';
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
