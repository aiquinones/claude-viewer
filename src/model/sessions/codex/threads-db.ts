// Everything a Codex row needs that isn't in the log, out of `~/.codex/state_<n>.sqlite`.
//
// Unlike the other two CLIs there is no per-session metadata file to open — Codex keeps one `threads`
// table for the machine, holding the rollout path, the working directory, the opening prompt, the
// model and the git details for every thread it has ever run. So this is one query for every live
// row, the shape `copilot/usage-db.ts` already uses, and the loader never walks the sessions tree.
//
// Nothing here throws and nothing here logs. A machine without `node:sqlite`, without the database,
// or with a schema that has drifted returns no threads at all, which lands on no Codex rows.

import { codexStatePath } from '../../../config/paths';
import { recordRead } from '../../perf/recorder';
import { SqliteDatabase, closeDatabase, openDatabase } from '../sqlite';

// One row per thread asked about. `rollout_path` is stored absolute, so the log is reached without
// knowing the dated directory layout underneath `sessions/`.
//
// `thread_source` separates a thread the user started from one an agent spawned — see `isSubagent`,
// which is why the column is read rather than filtered in SQL: a build that stops writing it should
// list its threads rather than none of them.
//
// One placeholder per id rather than a JSON array, for the same reason as Copilot's: `json_each`
// needs the JSON1 extension and this build of SQLite is not guaranteed to carry it.
const THREAD_COLUMNS: string = `
  id, rollout_path, cwd, title, model, git_branch, git_origin_url,
  thread_source, created_at_ms, updated_at_ms
`;

const threadsSql = (count: number): string => `
  SELECT ${THREAD_COLUMNS}
    FROM threads
   WHERE id IN (${new Array(count).fill('?').join(', ')})
`;

// Every thread the database knows, for the usage scan — which is about the whole corpus rather than
// about what is running, so it has no set of ids to ask for.
const ALL_THREADS_SQL: string = `SELECT ${THREAD_COLUMNS} FROM threads`;

// What one thread's row says. The database's snake_case stops here.
export interface CodexThread {
  threadId: string;
  rolloutPath: string;
  cwd: string;
  // The opening prompt, verbatim and possibly many lines — Codex generates no title of its own, so
  // this column, `first_user_message` and `preview` all hold the same string. Trimmed to one line
  // by the loader, since it's a row.
  title: string;
  model: string;
  branch?: string;
  repository?: string;
  // A thread an agent spawned rather than one the user started.
  isSubagent: boolean;
  createdAt: number;
  updatedAt: number;
}

// The threads behind a set of live ids, keyed by id. A thread the database doesn't know is simply
// absent — the lock is written before the row lands, so a session in its first moments is normal.
export const readCodexThreads = async (
  threadIds: string[]
): Promise<Map<string, CodexThread>> => {
  if (threadIds.length === 0) return new Map();
  return queryThreads({ sql: threadsSql(threadIds.length), params: threadIds });
};

// Every thread on the machine, keyed by id. What the usage scan walks: each row names its own
// rollout, so this is the index that replaces a walk of the dated `sessions/` tree.
//
// A rollout the database doesn't list is a file Codex wrote before this table existed. Those predate
// `token_count` too, so they hold no usage to miss.
export const readAllCodexThreads = async (): Promise<Map<string, CodexThread>> =>
  queryThreads({ sql: ALL_THREADS_SQL, params: [] });

interface QueryThreadsArgs {
  sql: string;
  params: string[];
}

const queryThreads = async ({ sql, params }: QueryThreadsArgs): Promise<Map<string, CodexThread>> => {
  const threads: Map<string, CodexThread> = new Map();

  const path: string | undefined = await codexStatePath();
  if (!path) return threads;

  const began: number = performance.now();
  const database: SqliteDatabase | undefined = await openDatabase(path);
  if (!database) return threads;

  try {
    const rows: unknown[] = database.prepare(sql).all(...params);

    for (const row of rows) {
      const thread: CodexThread | undefined = toThread(row);
      if (thread) threads.set(thread.threadId, thread);
    }
  } catch {
    // A drifted schema — a renamed table or column — reads as no threads rather than as an error.
  } finally {
    closeDatabase(database);
    // The other read that isn't a file — see the same note in `copilot/usage-db.ts`. Without this
    // the one query behind every Codex row is missing from the launch cost.
    recordRead({ path, kind: 'db', bytes: 0, ms: performance.now() - began });
  }

  return threads;
};

// SQLite hands back whatever the columns hold, so every row is checked before it becomes a thread —
// the boundary a Zod schema guards on any surface that reads a file. Only the id and the rollout path
// are required: a row naming no log is one this surface can't draw.
const toThread = (row: unknown): CodexThread | undefined => {
  if (typeof row !== 'object' || row === null) return undefined;

  const {
    id,
    rollout_path: rolloutPath,
    cwd,
    title,
    model,
    git_branch: branch,
    git_origin_url: origin,
    thread_source: source,
    created_at_ms: createdAt,
    updated_at_ms: updatedAt
  } = row as Record<string, unknown>;

  if (typeof id !== 'string' || typeof rolloutPath !== 'string' || !rolloutPath) return undefined;

  return {
    threadId: id,
    rolloutPath,
    cwd: text(cwd),
    title: text(title),
    model: text(model),
    branch: text(branch) || undefined,
    repository: repositoryOf(text(origin)),
    isSubagent: text(source) === 'subagent',
    createdAt: count(createdAt),
    updatedAt: count(updatedAt)
  };
};

// Codex generates no title, so its `title` column is the opening prompt verbatim — many lines of it,
// in the ordinary case. Both surfaces that name a thread want one line, and what the column holds is
// this module's business rather than each caller's.
export const threadTitle = (thread: CodexThread): string | undefined => {
  const line: string = thread.title.split('\n')[0].trim();
  return line || undefined;
};

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

const count = (value: unknown): number => (typeof value === 'number' ? value : 0);

// `https://github.com/owner/repo.git` → `owner/repo`, which is what a row prints and what Copilot's
// `workspace.yaml` already carries in that form. An origin in any other shape is left out rather
// than half-parsed.
const REPOSITORY = /[/:]([^/:]+\/[^/]+?)(?:\.git)?\/?$/;

const repositoryOf = (origin: string): string | undefined => {
  const match: RegExpExecArray | null = REPOSITORY.exec(origin);
  return match ? match[1] : undefined;
};
