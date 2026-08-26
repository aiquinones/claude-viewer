// Opening a CLI's own SQLite file, for the two loaders that have to. Copilot files its context sizes
// in one, and Codex keeps its whole thread index in one — both are databases the CLI owns and holds
// open with a WAL while a session runs, so everything here is read-only and nothing here throws.
//
// `node:sqlite` is a built-in, but an experimental one: it landed in Node 22.5, and a host that
// predates it, or one built without it, has no module to give. That host reads as no data rather
// than as an extension that fails to activate — the same degrade-don't-crash rule the config loaders
// follow. Its types are declared in `node-sqlite.d.ts`, since `@types/node` is on v20.

type SqliteModule = typeof import('node:sqlite');

export type SqliteDatabase = InstanceType<SqliteModule['DatabaseSync']>;

// Read-only, and it must stay that way: the file belongs to the CLI. `readOnly` also means a missing
// file throws here rather than being created, which is the outcome wanted.
export const openDatabase = async (path: string): Promise<SqliteDatabase | undefined> => {
  const sqlite: SqliteModule | undefined = await loadSqlite();
  if (!sqlite) return undefined;

  try {
    return new sqlite.DatabaseSync(path, { readOnly: true });
  } catch {
    return undefined;
  }
};

export const closeDatabase = (database: SqliteDatabase): void => {
  try {
    database.close();
  } catch {
    // Nothing to do about a database that won't close, and nothing worth saying about it.
  }
};

// Imported here rather than at the top of the file, so a host without the module degrades instead of
// failing to load.
const loadSqlite = async (): Promise<SqliteModule | undefined> => {
  try {
    return await import('node:sqlite');
  } catch {
    return undefined;
  }
};
