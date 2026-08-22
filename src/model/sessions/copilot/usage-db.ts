// How full a Copilot session's context is, out of `~/.copilot/session-state`'s sibling database.
//
// The CLI marks `assistant.usage` ephemeral, so it never reaches `events.jsonl` — but the writer
// special-cases that one event on the way out and hands it to the usage store instead. So the number
// is on disk, just not in the file the rest of this loader reads.
//
// Nothing here throws and nothing here logs. A machine without `node:sqlite`, without the database,
// or with a schema that has drifted returns no readings at all, which lands on exactly the behaviour
// this surface had before it could read any: a row with no bar.

import { copilotSessionStorePath } from '../../../config/paths';
import { AgentContext } from '../../types';

// The last usage row for each of the sessions asked about. `input_tokens` is the whole prompt —
// `token_details_json` on the same row breaks it into input + cache_read + cache_write and those sum
// to it exactly — so unlike Claude's transcript there is nothing to add up here.
//
// Keyed off `MAX(id)` rather than off `created_at`: several rows share a turn and a timestamp, and the
// autoincrement is the only thing that says which the CLI wrote last.
//
// One placeholder per id rather than a JSON array: `json_each` would be tidier and needs the JSON1
// extension, which this build of SQLite is not guaranteed to carry.
const lastUsageSql = (count: number): string => `
  SELECT session_id, model, input_tokens
    FROM assistant_usage_events
   WHERE id IN (
     SELECT MAX(id) FROM assistant_usage_events
      WHERE session_id IN (${new Array(count).fill('?').join(', ')})
      GROUP BY session_id
   )
`;

// Session id → how full its context is. Absent for a session with no finished turn, which is the
// same reason a fresh Claude session has no reading.
export const readCopilotContexts = async (
  sessionIds: string[]
): Promise<Map<string, AgentContext>> => {
  const contexts: Map<string, AgentContext> = new Map();
  if (sessionIds.length === 0) return contexts;

  const database: SqliteDatabase | undefined = await open();
  if (!database) return contexts;

  try {
    const rows: unknown[] = database.prepare(lastUsageSql(sessionIds.length)).all(...sessionIds);

    for (const row of rows) {
      const reading: SessionReading | undefined = toReading(row);
      if (reading) contexts.set(reading.sessionId, reading.context);
    }
  } catch {
    // A drifted schema — a renamed table or column — reads as no data rather than as an error. The
    // same degrade-don't-crash rule the config loaders follow.
  } finally {
    close(database);
  }

  return contexts;
};

// Read-only, and it must stay that way: the file belongs to the CLI, which holds it open with a WAL
// while a session is running. `readOnly` also means a missing file throws here rather than being
// created, which is the outcome wanted.
const open = async (): Promise<SqliteDatabase | undefined> => {
  const sqlite: SqliteModule | undefined = await loadSqlite();
  if (!sqlite) return undefined;

  try {
    return new sqlite.DatabaseSync(copilotSessionStorePath(), { readOnly: true });
  } catch {
    return undefined;
  }
};

const close = (database: SqliteDatabase): void => {
  try {
    database.close();
  } catch {
    // Nothing to do about a database that won't close, and nothing worth saying about it.
  }
};

// `node:sqlite` is a built-in, but an experimental one — it landed in Node 22.5, and a host that
// predates it, or one built without it, has no module to give. Imported here rather than at the top
// of the file so that host is a row without a bar instead of an extension that fails to activate.
// Its types are declared in `node-sqlite.d.ts`, since `@types/node` is on v20.
const loadSqlite = async (): Promise<SqliteModule | undefined> => {
  try {
    return await import('node:sqlite');
  } catch {
    return undefined;
  }
};

type SqliteModule = typeof import('node:sqlite');

type SqliteDatabase = InstanceType<SqliteModule['DatabaseSync']>;

interface SessionReading {
  sessionId: string;
  context: AgentContext;
}

// SQLite hands back whatever the columns hold, so every row is checked before it becomes a reading —
// this is the boundary a Zod schema would guard on any surface that reads a file. The database's
// snake_case stops here. A zero or a null token count is a row that measured nothing and is not one.
const toReading = (row: unknown): SessionReading | undefined => {
  if (typeof row !== 'object' || row === null) return undefined;

  const { session_id: sessionId, model, input_tokens: tokens } = row as Record<string, unknown>;
  if (typeof sessionId !== 'string' || typeof tokens !== 'number' || tokens <= 0) return undefined;

  return { sessionId, context: { tokens, model: typeof model === 'string' ? model : '' } };
};
