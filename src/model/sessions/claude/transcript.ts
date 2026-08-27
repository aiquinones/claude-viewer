import { FileHead, FileTail, readFileHead, readFileTail } from '../../../config/read';
import { ConfigError, Result, ok } from '../../../config/result';
import { AgentContext, AgentPullRequest, ConfigIssue, TranscriptTail } from '../../types';
import { ContentBlock, TranscriptLine, parseTranscriptLine } from './transcript-schema';

// How much of the end of a transcript is read. The last prompt, the PR link and the trailing turn
// all sit in the last few kilobytes of one — except when a single line is bigger than the window.
// A `Read` of a large file writes its result as one line, and 150 of the lines measured here go
// past 64KB, up to 932KB: the window lands entirely inside one, its only line is torn, and the walk
// below has nothing left to read. So the window grows until it holds a message line and stops
// there, the same shape the title's head read takes. One read in the ordinary case; 1MB covered
// every transcript on this machine.
const TAIL_WINDOWS: readonly number[] = [64 * 1024, 256 * 1024, 1024 * 1024];

// The title is at the *other* end, and how far in varies more than you'd want to hardcode: usually
// around 20KB, but 308KB in one session measured here — a session that opens with a long first turn
// writes its title late. So the head is read in growing windows and stops at the first hit, which
// costs one read in the ordinary case. Past the last window a session simply has no title.
const TITLE_WINDOWS: readonly number[] = [32 * 1024, 128 * 1024, 512 * 1024];

// The line types that are conversation. The other ten are session metadata interleaved into the
// same stream — an `ai-title` rewrite lands after the final assistant line often enough that
// reading the literal last line calls an idle session busy.
const MESSAGE_TYPES: readonly string[] = ['user', 'assistant'];

// The model on a line the CLI wrote itself rather than asked for — a session-limit notice, an
// expired token. They're `assistant` lines with an all-zero usage block, so nothing but the name
// tells them apart from a request that happened to be cheap. `usage/claude/scan.ts` skips them for
// the same reason: four of the transcripts measured here end on one, and taking it as the latest
// reading calls a 235k session empty.
const SYNTHETIC_MODEL: string = '<synthetic>';

// The marker on a `user` line that is a slash command rather than a prompt. `/clear` and the rest
// are handled locally: the line is written to the transcript and nothing is sent to the model.
const COMMAND_MARKER: string = '<command-name>';

// What `stop_reason` says about the turn. `tool_use` is the one that matters: the model's prose and
// the tool call it leads into are written as separate lines of one response, so a text-only line
// carrying it is the middle of a turn rather than the end. 2,064 of the 2,573 text-only assistant
// lines measured here are that line, each one followed by its tool call a few seconds later — long
// enough for several polls to land on it.
const TURN_OVER: readonly string[] = ['end_turn', 'stop_sequence', 'max_tokens', 'refusal'];
const TURN_CONTINUES: readonly string[] = ['tool_use', 'pause_turn'];

export interface TranscriptSummary {
  // The file isn't on disk. Distinct from one that couldn't be read: a session that has never been
  // prompted has written nothing yet, and there is no conversation to show for it.
  missing: boolean;
  title?: string;
  lastPrompt?: string;
  pullRequest?: AgentPullRequest;
  tail: TranscriptTail;
  pendingTool?: string;
  // How full the model's context was on the last real request. Absent when the window holds no such
  // request — a session that hasn't finished an assistant turn has nothing to measure.
  context?: AgentContext;
  // File mtime, or 0 when the file couldn't be read.
  lastActivityAt: number;
  issues: ConfigIssue[];
}

// What a session row needs, off both ends of the file. Never throws: a missing or unreadable
// transcript still produces a summary, carrying the reason as an issue.
export const readTranscript = async (path: string): Promise<TranscriptSummary> => {
  const read: Result<TranscriptWindow, ConfigError> = await readTail(path);

  if (!read.ok) {
    const message: string =
      read.error.kind === 'not-found'
        ? 'no transcript on disk yet — nothing has been written for this session'
        : `could not read the transcript: ${read.error.message}`;
    return {
      tail: 'settled',
      missing: read.error.kind === 'not-found',
      lastActivityAt: 0,
      issues: [warning(message)]
    };
  }

  const lines: TranscriptLine[] = read.value.lines;

  return {
    ...lastTurn(lines),
    missing: false,
    context: lastContext(lines),
    title: await firstTitle(path),
    // Rewritten through the session, so the last one in the window is the current one. Both stay
    // near the end: a PR link is repeated every few thousand lines after it's opened.
    lastPrompt: lastValue(lines, 'last-prompt', (line) => line.lastPrompt),
    pullRequest: lastPullRequest(lines),
    lastActivityAt: read.value.mtimeMs,
    issues: []
  };
};

interface TranscriptWindow {
  lines: TranscriptLine[];
  mtimeMs: number;
}

// The end of the file, widened until there is a turn in it to read. Each window is a fresh read
// rather than an extension of the one before: a transcript is appended to while it's being read, so
// two reads stitched together would carry a seam through the middle of them.
//
// The loop stops at the first window holding a message line, which is the question `lastTurn` asks.
// The other three fields read off this window can still fall outside it — a pasted image is a 57KB
// `user` line that satisfies the loop while pushing the last context reading past the edge — and
// they're carried across polls by `carry-forward.ts` instead. Growing for each of them separately
// would mean reading the file once per field.
const readTail = async (path: string): Promise<Result<TranscriptWindow, ConfigError>> => {
  let widest: TranscriptWindow | undefined;

  for (const maxBytes of TAIL_WINDOWS) {
    const read: Result<FileTail, ConfigError> = await readFileTail({ path, maxBytes });
    if (!read.ok) return read;

    const lines: TranscriptLine[] = parseLines(read.value.text, read.value.truncated);
    widest = { lines, mtimeMs: read.value.mtimeMs };

    // A window with a turn in it answers the question. So does the whole file: there is nothing
    // further back to widen into, whether or not it found one.
    if (lines.some(isMessage) || !read.value.truncated) break;
  }

  // The loop runs at least once, so this is the last window read rather than a default.
  return ok(widest ?? { lines: [], mtimeMs: 0 });
};

const isMessage = (line: TranscriptLine): boolean => MESSAGE_TYPES.includes(line.type);

// The first `ai-title` in the file. Claude Code rewrites the title as the session goes on and the
// later ones chase whatever the newest turn was about — "Online implementation" for a session that
// started as "Add context text to skill view cost section". The first one names the session, and
// it's what the editor's own header shows.
const firstTitle = async (path: string): Promise<string | undefined> => {
  for (const window of TITLE_WINDOWS) {
    const read: Result<FileHead, ConfigError> = await readFileHead({ path, maxBytes: window });
    if (!read.ok) return undefined;

    // The last line of a window is cut mid-line and fails to parse, which drops it — except when
    // the whole file fit, where there's nothing to be cut off and nothing more to read either.
    const found: string | undefined = firstValue(
      parseLines(read.value.text, false),
      'ai-title',
      (line) => line.aiTitle
    );
    if (found || read.value.atEnd) return found;
  }

  return undefined;
};

// A torn line is expected here, not corruption: a window starts or ends mid-file, and the file is
// being appended to while it's read. Both ends drop out silently.
const parseLines = (text: string, dropFirst: boolean): TranscriptLine[] => {
  const raw: string[] = text.split('\n');

  return (dropFirst ? raw.slice(1) : raw)
    .map(parseTranscriptLine)
    .filter((line): line is TranscriptLine => line !== undefined);
};

const lastValue = (
  lines: TranscriptLine[],
  type: string,
  read: (line: TranscriptLine) => string | undefined
): string | undefined => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].type !== type) continue;
    const value: string | undefined = read(lines[i]);
    if (value) return value;
  }
  return undefined;
};

const firstValue = (
  lines: TranscriptLine[],
  type: string,
  read: (line: TranscriptLine) => string | undefined
): string | undefined => {
  for (const line of lines) {
    if (line.type !== type) continue;
    const value: string | undefined = read(line);
    if (value) return value;
  }
  return undefined;
};

// The PR this session opened. Every session measured here opened at most one, and the line is
// repeated after it's opened — so the last copy is both the current one and the one nearest the end.
const lastPullRequest = (lines: TranscriptLine[]): AgentPullRequest | undefined => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line: TranscriptLine = lines[i];
    if (line.type !== 'pr-link') continue;
    // Both fields or neither: a number with no link has nowhere to go.
    if (line.prNumber !== undefined && line.prUrl) {
      return { number: line.prNumber, url: line.prUrl };
    }
  }
  return undefined;
};

// Walk back to the last line that is actually a message, and read whether its turn is over. The
// line says so itself in `stop_reason`, which is the only thing that separates the two text-only
// assistant lines that look identical: the one ending a turn, and the one the model writes just
// before a tool call.
const lastTurn = (lines: TranscriptLine[]): Pick<TranscriptSummary, 'tail' | 'pendingTool'> => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line: TranscriptLine = lines[i];
    if (!isMessage(line)) continue;
    if (line.type === 'user') {
      if (!isPrompt(line)) continue;
      return { tail: 'working' };
    }
    // An error ended the turn as surely as text would have.
    if (line.isApiErrorMessage) return { tail: 'settled' };

    const blocks: ContentBlock[] = contentBlocks(line);
    // Named only when this line is the tool call. The prose line ahead of it carries the same
    // `stop_reason` and doesn't yet know what the tool will be, which is a row that says Working
    // without naming one — true, and all the log supports at that moment.
    const tool: ContentBlock | undefined = blocks.find((block) => block.type === 'tool_use');
    const stop: string | null | undefined = line.message?.stop_reason;

    if (stop && TURN_OVER.includes(stop)) return { tail: 'settled' };
    if (stop && TURN_CONTINUES.includes(stop)) return { tail: 'working', pendingTool: tool?.name };

    // No reason, or one this doesn't know yet. Fall back to the shape of the blocks, which is what
    // this rule was before: a completed turn ends on text alone, so anything else is mid-turn. It's
    // the weaker reading — it's what called the prose line a finished turn — but an unrecognised
    // `stop_reason` is the format drifting rather than a turn ending, and the nine lines in 17,007
    // measured here that carry none are responses cut off mid-stream.
    if (blocks.length > 0 && blocks.every((block) => block.type === 'text')) {
      return { tail: 'settled' };
    }
    return { tail: 'working', pendingTool: tool?.name };
  }

  // Nothing but metadata in the window. `readTail` widens until a message line is in it, so getting
  // here means the file genuinely holds no turn yet — a session prompted but not yet answered.
  return { tail: 'settled' };
};

// Whether a `user` line is a prompt the model was asked to answer. A slash command writes two that
// aren't — an `isMeta` caveat and the command itself — and neither leaves a turn outstanding.
const isPrompt = (line: TranscriptLine): boolean => {
  if (line.isMeta) return false;

  // A tool result is an array of blocks; only the handful of lines carrying a bare string can be
  // a command, so anything else is a prompt.
  const content = line.message?.content;
  return typeof content !== 'string' || !content.includes(COMMAND_MARKER);
};

// How full the context was on the most recent real request. The three input figures add up because
// every turn re-reads the whole conversation — which part of it was cached is a billing question,
// not a size one. Output isn't in it: what the model wrote this turn is counted in the next
// request's input.
//
// Its own walk rather than a field on `lastTurn`: the last message line is often a `user` one, and
// the last assistant line is often synthetic. Measured over 77 recent transcripts, 72 carry a
// reading inside the 64KB window — the five that don't are sessions with no finished assistant turn.
//
// A compacted session needs no special case. The last request's input *is* the current context, so
// the smaller number appears by itself on the next turn.
const lastContext = (lines: TranscriptLine[]): AgentContext | undefined => {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line: TranscriptLine = lines[index];
    if (line.type !== 'assistant') continue;

    const usage = line.message?.usage;
    if (!usage || line.message?.model === SYNTHETIC_MODEL) continue;

    const tokens: number =
      (usage.input_tokens ?? 0) +
      (usage.cache_read_input_tokens ?? 0) +
      (usage.cache_creation_input_tokens ?? 0);
    if (tokens <= 0) continue;

    return { tokens, model: line.message?.model ?? '' };
  }

  return undefined;
};

// `content` is an array of blocks, except on the handful of lines where it's a bare string.
const contentBlocks = (line: TranscriptLine): ContentBlock[] => {
  const content = line.message?.content;
  if (typeof content === 'string') return [{ type: 'text' }];
  return content ?? [];
};

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });
