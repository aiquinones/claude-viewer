import { FileTail, readFileTail } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { ConfigIssue, TranscriptTail } from '../../types';
import { RolloutLine, lineKind, parseRolloutLine } from './rollout-schema';

// How much of the end of the rollout is read. The same window Copilot's log gets, and for the same
// reason: Codex inlines encrypted reasoning and whole tool outputs, so a single
// `custom_tool_call_output` ran 30KB in a session measured here and the opening `session_meta` line
// alone was 18KB. A window that yields no parseable line is a normal outcome, not an error.
const TAIL_BYTES: number = 256 * 1024;

export interface CodexRolloutSummary {
  lastPrompt?: string;
  tail: TranscriptTail;
  pendingTool?: string;
  // How full the context was on the last request. Not an `AgentContext`, which also names the model
  // — the rollout doesn't say which model answered, so the loader pairs this with the `threads` row.
  contextTokens?: number;
  // The window the log states, which Codex is alone in recording. Separate from the tokens because
  // `task_started` carries it before any request has been measured.
  contextWindow?: number;
  // File mtime, or 0 when the file couldn't be read.
  lastActivityAt: number;
  issues: ConfigIssue[];
}

// What a row needs, off the end of one rollout file. Never throws: a missing or unreadable log still
// produces a summary, carrying the reason as an issue.
export const readRollout = async (path: string): Promise<CodexRolloutSummary> => {
  const read: Result<FileTail, ConfigError> = await readFileTail({ path, maxBytes: TAIL_BYTES });

  if (!read.ok) {
    const message: string =
      read.error.kind === 'not-found'
        ? 'no rollout log on disk yet — nothing has been written for this thread'
        : `could not read the rollout log: ${read.error.message}`;
    return { tail: 'settled', lastActivityAt: 0, issues: [warning(message)] };
  }

  const lines: RolloutLine[] = parseLines(read.value.text, read.value.truncated);

  return {
    ...codexTail(lines),
    ...usage(lines),
    lastPrompt: lastPrompt(lines),
    lastActivityAt: read.value.mtimeMs,
    issues: []
  };
};

// A window starts mid-file and the file is being appended to while it's read, so a torn line at
// either end is normal. Both drop out silently.
const parseLines = (text: string, dropFirst: boolean): RolloutLine[] => {
  const raw: string[] = text.split('\n');

  return (dropFirst ? raw.slice(1) : raw)
    .map(parseRolloutLine)
    .filter((line): line is RolloutLine => line !== undefined);
};

// Walk back to the first line that settles what the agent is doing.
//
// Both halves of the vocabulary are matched, which is the trap `copilotTail` fell into: matching only
// the lines that mean "done" sails past a live turn and lands on the *previous* turn's end, reporting
// a working agent as idle from a session's second turn on. So `task_started` is here too.
//
// Open tool calls are matched by `call_id` rather than by position — Codex runs tools in parallel, so
// a completed one can sit after a still-open one.
//
// There is no `blocked` case. Codex writes no approval or permission line to the rollout in any
// session on this machine, so a Codex row waits the way a Claude one does: on the clock in
// `activity.ts`, not on a stated fact.
//
// Exported because it's the whole status rule and it's pure — the same seam `copilotTail` has, and
// what lets the tests read it without a disk.
export const codexTail = (
  lines: RolloutLine[]
): Pick<CodexRolloutSummary, 'tail' | 'pendingTool'> => {
  const finished: Set<string> = new Set();

  for (const line of lines) {
    const kind: string = lineKind(line);
    if (kind !== 'response_item/custom_tool_call_output' && kind !== 'response_item/function_call_output') {
      continue;
    }
    if (line.payload?.call_id) finished.add(line.payload.call_id);
  }

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line: RolloutLine = lines[i];
    const kind: string = lineKind(line);

    if (kind === 'response_item/custom_tool_call' || kind === 'response_item/function_call') {
      const callId: string | undefined = line.payload?.call_id;
      if (!callId || !finished.has(callId)) {
        return { tail: 'working', pendingTool: line.payload?.name || undefined };
      }
      continue;
    }

    // The turn is over: finished at the completion, cancelled at the abort. `turn_aborted` is the one
    // path that reaches here with no `task_complete` behind it — an escaped turn leaves its
    // `task_started` as the last thing said about it.
    if (kind === 'event_msg/task_complete' || kind === 'event_msg/turn_aborted') {
      return { tail: 'settled' };
    }

    // The model has the turn: it opened one, or it's writing into one.
    if (kind === 'event_msg/task_started' || kind === 'response_item/reasoning') {
      return { tail: 'working' };
    }

    if (kind === 'response_item/message' || kind === 'event_msg/item_completed') {
      return { tail: 'working' };
    }
  }

  // A window holding no line that says either way. A fresh session and a very long tool output both
  // land here, and neither is an agent doing nothing — but the age beside the badge is what carries
  // that, so this reads as settled rather than inventing a turn.
  return { tail: 'settled' };
};

// How full the context is, and how big it is. Codex is the only CLI here that records the window
// itself, so neither number is a guess: both ride `token_count`, and `task_started` carries the
// window alone for a session that hasn't finished a request yet.
//
// `last_token_usage.input_tokens` is the whole prompt the request carried — Copilot's convention
// rather than Claude's, where the three input counters are disjoint and have to be summed. So there
// is nothing to add up here.
const usage = (
  lines: RolloutLine[]
): Pick<CodexRolloutSummary, 'contextTokens' | 'contextWindow'> => {
  let contextWindow: number | undefined;
  let contextTokens: number | undefined;

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const payload = lines[i].payload;

    const window: number | undefined =
      payload?.info?.model_context_window ?? payload?.model_context_window;
    if (window && !contextWindow) contextWindow = window;

    const tokens: number | undefined = payload?.info?.last_token_usage?.input_tokens;
    if (tokens && tokens > 0 && !contextTokens) contextTokens = tokens;

    if (contextTokens && contextWindow) break;
  }

  return { contextTokens, contextWindow };
};

// The last thing the user typed, off the friendly `item_completed` stream. The raw `response_item`
// messages carry developer and system text too, which is not a prompt.
const lastPrompt = (lines: RolloutLine[]): string | undefined => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const item = lines[i].payload?.item;
    if (lineKind(lines[i]) !== 'event_msg/item_completed' || item?.type !== 'UserMessage') continue;

    const text: string | undefined = item.content?.find((part) => part.text)?.text;
    if (text) return text;
  }
  return undefined;
};

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });
