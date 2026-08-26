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
import { recordRead } from '../../perf/recorder';
import { AgentContext } from '../../types';
import { ContextPoint } from '../../usage/types';
import { SqliteDatabase, closeDatabase, openDatabase } from '../sqlite';

// The last usage row for each conversation in each of the sessions asked about. `input_tokens` is
// the whole prompt — `token_details_json` on the same row breaks it into input + cache_read +
// cache_write and those sum to it exactly — so unlike Claude's transcript there is nothing to add up
// here.
//
// The grouping is by `parent_tool_call_id` as well as by session, and that second column is the
// whole point: a sub-agent's requests land in this table under the same `session_id`, so grouping by
// session alone hands back the sub-agent's prompt whenever one is mid-flight — a bar that dips by a
// few thousand tokens and recovers, measuring a conversation the row isn't about. The session's own
// rows are the ones with no parent, which SQLite groups together as one NULL group.
//
// Keyed off `MAX(id)` rather than off `created_at`: several rows share a turn and a timestamp, and the
// autoincrement is the only thing that says which the CLI wrote last.
//
// One placeholder per id rather than a JSON array: `json_each` would be tidier and needs the JSON1
// extension, which this build of SQLite is not guaranteed to carry.
const lastUsageSql = (count: number): string => `
  SELECT session_id, parent_tool_call_id, model, input_tokens
    FROM assistant_usage_events
   WHERE id IN (
     SELECT MAX(id) FROM assistant_usage_events
      WHERE session_id IN (${new Array(count).fill('?').join(', ')})
      GROUP BY session_id, parent_tool_call_id
   )
`;

// Every usage row for one session, oldest first. `created_at` is ISO with milliseconds, which is
// what places a point on a chart's clock; `id` is what orders it, for the same reason the query
// above reads `MAX(id)` — rows within a turn share a timestamp.
//
// Sub-agent rows are excluded. A sub-agent is a conversation of its own, so its prompt size measures
// something else, and a row of it dropped into this series would draw a dip the session never had.
// No build seen here writes the column, which makes this a no-op today and correct if that changes.
const seriesSql: string = `
  SELECT model, input_tokens, created_at
    FROM assistant_usage_events
   WHERE session_id = ?
     AND parent_tool_call_id IS NULL
   ORDER BY id
`;

// How full one session's context was at each request it made. The whole prompt per row —
// `input_tokens` here already includes both cache figures, unlike Claude's three separate counters.
//
// Empty for a session with no usable row, and for a machine with no database or no `node:sqlite`.
// The chart then has nothing to draw, which is the same answer a row with no bar gives.
export const readCopilotContextSeries = async (sessionId: string): Promise<ContextPoint[]> => {
  const began: number = performance.now();
  const database: SqliteDatabase | undefined = await openDatabase(copilotSessionStorePath());
  if (!database) return [];

  try {
    const rows: unknown[] = database.prepare(seriesSql).all(sessionId);
    return rows
      .map(toPoint)
      .filter((point): point is ContextPoint => point !== undefined)
      .sort((left, right) => left.at - right.at);
  } catch {
    // A drifted schema reads as no series rather than as an error, the same as above.
    return [];
  } finally {
    closeDatabase(database);
    recordQuery(began);
  }
};

// Session id → how full its context is, and how full each of its sub-agents' is. Both are absent
// for a conversation with no finished turn, which is the same reason a fresh Claude session has no
// reading.
export const readCopilotContexts = async (
  sessionIds: string[]
): Promise<Map<string, CopilotContexts>> => {
  const began: number = performance.now();
  const contexts: Map<string, CopilotContexts> = new Map();
  if (sessionIds.length === 0) return contexts;

  const database: SqliteDatabase | undefined = await openDatabase(copilotSessionStorePath());
  if (!database) return contexts;

  try {
    const rows: unknown[] = database.prepare(lastUsageSql(sessionIds.length)).all(...sessionIds);

    for (const row of rows) {
      const reading: SessionReading | undefined = toReading(row);
      if (!reading) continue;

      const found: CopilotContexts = contexts.get(reading.sessionId) ?? { subagents: new Map() };
      if (reading.subagentId) found.subagents.set(reading.subagentId, reading.context);
      else found.session = reading.context;
      contexts.set(reading.sessionId, found);
    }
  } catch {
    // A drifted schema — a renamed table or column — reads as no data rather than as an error. The
    // same degrade-don't-crash rule the config loaders follow.
  } finally {
    closeDatabase(database);
    recordQuery(began);
  }

  return contexts;
};

// One of the two reads in the extension that aren't files, so it doesn't come through
// `config/read.ts` and has to say so itself — otherwise a slow launch on a machine full of Copilot
// sessions has a gap where its biggest read should be. Codex's thread index is the other.
const recordQuery = (began: number): void =>
  recordRead({
    path: copilotSessionStorePath(),
    kind: 'db',
    bytes: 0,
    ms: performance.now() - began
  });

// What one session's rows in that table say. The two are read the same way and mean different
// conversations, which is why they aren't one number.
export interface CopilotContexts {
  // The session's own, off its last row that isn't a sub-agent's.
  session?: AgentContext;
  // Keyed by the `task` tool call that started the sub-agent, which is what `Subagent.id` holds.
  subagents: Map<string, AgentContext>;
}

interface SessionReading {
  sessionId: string;
  // The sub-agent this row belongs to, or undefined for the session's own.
  subagentId?: string;
  context: AgentContext;
}

// One series row → a point, or nothing. Same boundary `toReading` guards, and the same rule about a
// zero token count: a row that measured nothing is not a measurement of nothing.
const toPoint = (row: unknown): ContextPoint | undefined => {
  if (typeof row !== 'object' || row === null) return undefined;

  const { model, input_tokens: tokens, created_at: at } = row as Record<string, unknown>;
  if (typeof tokens !== 'number' || tokens <= 0 || typeof at !== 'string') return undefined;

  const parsed: number = Date.parse(at);
  if (Number.isNaN(parsed)) return undefined;

  return { at: parsed, tokens, model: typeof model === 'string' ? model : '' };
};

// SQLite hands back whatever the columns hold, so every row is checked before it becomes a reading —
// this is the boundary a Zod schema would guard on any surface that reads a file. The database's
// snake_case stops here. A zero or a null token count is a row that measured nothing and is not one.
const toReading = (row: unknown): SessionReading | undefined => {
  if (typeof row !== 'object' || row === null) return undefined;

  const {
    session_id: sessionId,
    parent_tool_call_id: parent,
    model,
    input_tokens: tokens
  } = row as Record<string, unknown>;
  if (typeof sessionId !== 'string' || typeof tokens !== 'number' || tokens <= 0) return undefined;

  return {
    sessionId,
    subagentId: typeof parent === 'string' && parent ? parent : undefined,
    context: { tokens, model: typeof model === 'string' ? model : '' }
  };
};
