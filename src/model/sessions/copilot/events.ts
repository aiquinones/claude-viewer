import { FileHead, FileTail, readFileHead, readFileTail } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { ConfigIssue, Subagent, TranscriptTail } from '../../types';
import { CopilotEvent, parseEvent } from './event-schema';
import { runningSubagents } from './subagents';

// How much of the end of the log is read. Four times what the Claude transcript reader uses, and it
// has to be: Copilot writes `encryptedContent` and `reasoningOpaque` blobs inline, so one
// `assistant.message` line runs about 10KB and the `system.message` holding the system prompt was
// 77KB in a session measured here — larger than that reader's whole window.
const TAIL_BYTES: number = 256 * 1024;

// `session.start` is the first line of the file and carries the CLI version, so one small window
// gets it. No growing windows: unlike Claude's title, this line's position is guaranteed.
const HEAD_BYTES: number = 16 * 1024;

export interface CopilotEventSummary {
  lastPrompt?: string;
  tail: TranscriptTail;
  pendingTool?: string;
  // The sub-agents still out, in the order they were started. Empty is the ordinary case.
  subagents: Subagent[];
  version?: string;
  // File mtime, or 0 when the file couldn't be read.
  lastActivityAt: number;
  issues: ConfigIssue[];
}

// What a session row needs, off both ends of the event log. Never throws: a missing or unreadable
// log still produces a summary, carrying the reason as an issue.
export const readEvents = async (path: string): Promise<CopilotEventSummary> => {
  const read: Result<FileTail, ConfigError> = await readFileTail({ path, maxBytes: TAIL_BYTES });

  if (!read.ok) {
    const message: string =
      read.error.kind === 'not-found'
        ? 'no event log on disk yet — nothing has been written for this session'
        : `could not read the event log: ${read.error.message}`;
    return { tail: 'settled', subagents: [], lastActivityAt: 0, issues: [warning(message)] };
  }

  const events: CopilotEvent[] = parseEvents(read.value.text, read.value.truncated);

  return {
    ...copilotTail(events),
    subagents: runningSubagents(events),
    lastPrompt: lastPrompt(events),
    version: await startVersion(path),
    lastActivityAt: read.value.mtimeMs,
    issues: []
  };
};

// A window starts mid-file and the file is being appended to while it's read, so a torn line at
// either end is normal. Both drop out silently.
const parseEvents = (text: string, dropFirst: boolean): CopilotEvent[] => {
  const raw: string[] = text.split('\n');

  return (dropFirst ? raw.slice(1) : raw)
    .map(parseEvent)
    .filter((event): event is CopilotEvent => event !== undefined);
};

// The CLI version, off `session.start` at the head of the file.
const startVersion = async (path: string): Promise<string | undefined> => {
  const read: Result<FileHead, ConfigError> = await readFileHead({ path, maxBytes: HEAD_BYTES });
  if (!read.ok) return undefined;

  // The last line of the window is cut mid-line and drops out, which is fine — the line wanted is
  // the first one.
  const events: CopilotEvent[] = parseEvents(read.value.text, false);
  return events.find((event) => event.type === 'session.start')?.data?.copilotVersion;
};

const lastPrompt = (events: CopilotEvent[]): string | undefined => {
  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].type !== 'user.message') continue;
    const content: string | undefined = events[i].data?.content;
    if (content) return content;
  }
  return undefined;
};

// Walk back to the first event that settles what the agent is doing. The two "open" cases are
// matched by id rather than by position: Copilot runs tools in parallel, so a completed one can sit
// after a still-open one.
//
// Exported because it's the whole status rule and it's pure — same seam `activity.ts` and
// `context.ts` have, and what lets the tests read it without a disk.
export const copilotTail = (
  events: CopilotEvent[]
): Pick<CopilotEventSummary, 'tail' | 'pendingTool'> => {
  const answered: Set<string> = new Set();
  const finished: Set<string> = new Set();

  for (const event of events) {
    if (event.type === 'permission.completed' && event.data?.requestId) {
      answered.add(event.data.requestId);
    }
    if (event.type === 'tool.execution_complete' && event.data?.toolCallId) {
      finished.add(event.data.toolCallId);
    }
  }

  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event: CopilotEvent = events[i];

    // A prompt with no answer means the agent is at it right now. This is the one state on the
    // surface that's read rather than inferred, so it beats everything below it.
    if (event.type === 'permission.requested') {
      const requestId: string | undefined = event.data?.requestId;
      if (!requestId || !answered.has(requestId)) {
        return { tail: 'blocked', pendingTool: toolName(event) };
      }
      continue;
    }

    if (event.type === 'tool.execution_start') {
      const toolCallId: string | undefined = event.data?.toolCallId;
      if (!toolCallId || !finished.has(toolCallId)) {
        return { tail: 'working', pendingTool: toolName(event) };
      }
      continue;
    }

    // The query is done: billed at the checkpoint, cancelled at the abort. Both are stated rather
    // than inferred, and `abort` is the one path that reaches here with no `assistant.turn_end`
    // behind it — a turn the user escaped leaves its `turn_start` as the last thing said about it.
    if (event.type === 'session.usage_checkpoint' || event.type === 'abort') {
      return { tail: 'settled' };
    }

    // The turn is over, and so is the process in the second case. A `turn_end` mid-query is
    // followed by the next `turn_start` within 3ms, so the walk above reaches that first and this
    // only fires on a turn that really is the last word in the log.
    if (event.type === 'assistant.turn_end' || event.type === 'session.shutdown') {
      return { tail: 'settled' };
    }

    // The model has the turn: it opened one, or it's writing into one. Without these the walk runs
    // past a live turn to the *previous* turn_end and reports a working agent as idle — which is
    // every turn after a session's first, since the first has no turn_end behind it to find.
    if (event.type === 'assistant.turn_start' || event.type === 'assistant.message') {
      return { tail: 'working' };
    }

    // The prompt landed and the model has it.
    if (event.type === 'user.message') return { tail: 'working' };
  }

  // Nothing decisive in the window — no turn to read, so nothing is claimed about one.
  return { tail: 'settled' };
};

// The tool's name only. `data.arguments` holds the agent's own work — commands, paths, prompt
// fragments — and this panel gets screenshotted.
const toolName = (event: CopilotEvent): string | undefined => {
  const name: string | undefined = event.data?.toolName;
  if (!name) return undefined;

  const server: string | undefined = event.data?.mcpServerName;
  return server ? `${server}:${name}` : name;
};

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });
