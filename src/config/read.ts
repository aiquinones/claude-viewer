import { promises as fs } from 'node:fs';
import { Result, ConfigError, ok, err, configError } from './result';

// Reads a UTF-8 file. A missing file is a normal outcome here, not a failure to shout about.
export const readTextFile = async (path: string): Promise<Result<string, ConfigError>> => {
  try {
    return ok(await fs.readFile(path, 'utf8'));
  } catch (caught) {
    const code: string | undefined = (caught as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return err(configError('not-found', path, 'file does not exist'));
    return err(configError('unreadable', path, String((caught as Error).message ?? caught)));
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
