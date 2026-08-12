import { FileTail, readFileTail } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import { ConfigIssue, TranscriptTail } from '../types';
import { ContentBlock, TranscriptLine, parseTranscriptLine } from './transcript-schema';

// How much of the end of a transcript is read. They reach megabytes; the title, the last prompt and
// the trailing turn all sit in the last few kilobytes of one.
const TAIL_BYTES: number = 64 * 1024;

// The line types that are conversation. The other ten are session metadata interleaved into the
// same stream — an `ai-title` rewrite lands after the final assistant line often enough that
// reading the literal last line calls an idle session busy.
const MESSAGE_TYPES: readonly string[] = ['user', 'assistant'];

export interface TranscriptSummary {
  title?: string;
  lastPrompt?: string;
  tail: TranscriptTail;
  pendingTool?: string;
  // File mtime, or 0 when the file couldn't be read.
  lastActivityAt: number;
  issues: ConfigIssue[];
}

// What a session row needs, off the end of the file. Never throws: a missing or unreadable
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

  const lines: TranscriptLine[] = parseLines(read.value);

  return {
    ...lastTurn(lines),
    // Both are rewritten through the session, so the last one in the window is the current one.
    title: lastValue(lines, 'ai-title', (line) => line.aiTitle),
    lastPrompt: lastValue(lines, 'last-prompt', (line) => line.lastPrompt),
    lastActivityAt: read.value.mtimeMs,
    issues: []
  };
};

// A torn line is expected here, not corruption: the read starts mid-file, and the file is being
// appended to while it happens. Both ends drop out silently.
const parseLines = (tail: FileTail): TranscriptLine[] => {
  const raw: string[] = tail.text.split('\n');
  const usable: string[] = tail.truncated ? raw.slice(1) : raw;

  return usable
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
