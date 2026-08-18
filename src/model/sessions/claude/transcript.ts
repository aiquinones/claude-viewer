import { FileHead, FileTail, readFileHead, readFileTail } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { AgentPullRequest, ConfigIssue, TranscriptTail } from '../../types';
import { ContentBlock, TranscriptLine, parseTranscriptLine } from './transcript-schema';

// How much of the end of a transcript is read. They reach megabytes; the last prompt, the PR link
// and the trailing turn all sit in the last few kilobytes of one.
const TAIL_BYTES: number = 64 * 1024;

// The title is at the *other* end, and how far in varies more than you'd want to hardcode: usually
// around 20KB, but 308KB in one session measured here — a session that opens with a long first turn
// writes its title late. So the head is read in growing windows and stops at the first hit, which
// costs one read in the ordinary case. Past the last window a session simply has no title.
const TITLE_WINDOWS: readonly number[] = [32 * 1024, 128 * 1024, 512 * 1024];

// The line types that are conversation. The other ten are session metadata interleaved into the
// same stream — an `ai-title` rewrite lands after the final assistant line often enough that
// reading the literal last line calls an idle session busy.
const MESSAGE_TYPES: readonly string[] = ['user', 'assistant'];

export interface TranscriptSummary {
  title?: string;
  lastPrompt?: string;
  pullRequest?: AgentPullRequest;
  tail: TranscriptTail;
  pendingTool?: string;
  // File mtime, or 0 when the file couldn't be read.
  lastActivityAt: number;
  issues: ConfigIssue[];
}

// What a session row needs, off both ends of the file. Never throws: a missing or unreadable
// transcript still produces a summary, carrying the reason as an issue.
export const readTranscript = async (path: string): Promise<TranscriptSummary> => {
  const read: Result<FileTail, ConfigError> = await readFileTail({ path, maxBytes: TAIL_BYTES });

  if (!read.ok) {
    const message: string =
      read.error.kind === 'not-found'
        ? 'no transcript on disk yet — nothing has been written for this session'
        : `could not read the transcript: ${read.error.message}`;
    return { tail: 'settled', lastActivityAt: 0, issues: [warning(message)] };
  }

  const lines: TranscriptLine[] = parseLines(read.value.text, read.value.truncated);

  return {
    ...lastTurn(lines),
    title: await firstTitle(path),
    // Rewritten through the session, so the last one in the window is the current one. Both stay
    // near the end: a PR link is repeated every few thousand lines after it's opened.
    lastPrompt: lastValue(lines, 'last-prompt', (line) => line.lastPrompt),
    pullRequest: lastPullRequest(lines),
    lastActivityAt: read.value.mtimeMs,
    issues: []
  };
};

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

// Walk back to the last line that is actually a message, and read the shape of it. A completed turn
// always ends the same way — an assistant line whose only block is text — so everything else means
// the agent is mid-turn: a tool is out, or a result just landed and the model has it.
const lastTurn = (lines: TranscriptLine[]): Pick<TranscriptSummary, 'tail' | 'pendingTool'> => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line: TranscriptLine = lines[i];
    if (!MESSAGE_TYPES.includes(line.type)) continue;
    if (line.type === 'user') return { tail: 'working' };
    // An error ended the turn as surely as text would have.
    if (line.isApiErrorMessage) return { tail: 'settled' };

    const blocks: ContentBlock[] = contentBlocks(line);
    if (blocks.length > 0 && blocks.every((block) => block.type === 'text')) {
      return { tail: 'settled' };
    }

    const tool: ContentBlock | undefined = blocks.find((block) => block.type === 'tool_use');
    return { tail: 'working', pendingTool: tool?.name };
  }

  // Nothing but metadata in the window — no turn to read, so nothing is claimed about one.
  return { tail: 'settled' };
};

// `content` is an array of blocks, except on the handful of lines where it's a bare string.
const contentBlocks = (line: TranscriptLine): ContentBlock[] => {
  const content = line.message?.content;
  if (typeof content === 'string') return [{ type: 'text' }];
  return content ?? [];
};

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });
