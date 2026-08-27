import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { STALE_AFTER_MS, agentActivity } from '@src/model/sessions/activity';
import { TranscriptSummary, readTranscript } from '@src/model/sessions/claude/transcript';
import { AgentActivity } from '@src/model/types';
import fixtureRows from '../../../fixtures/claude-transcript.json';

// One row of the fixture: a transcript line stripped to what the turn rule reads, the size the real
// line was when that mattered, and the state a row should show once the file ends there. The
// `expected` values were reviewed by hand against the timeline — a poll can land between any two
// lines, so every prefix has an answer worth naming.
interface FixtureRow {
  expected: AgentActivity;
  padTo?: number;
  line: {
    type: string;
    timestamp?: string;
    message?: { content?: unknown; stop_reason?: string | null };
  };
}

const rows: FixtureRow[] = fixtureRows as FixtureRow[];

// The line numbers in the transcript this was cut from, so a failure names the line you can go and
// look at rather than an offset into the fixture.
const FIRST_LINE: number = 690;

// What `JSON.stringify` adds when the filler key goes on: `,"filler":""`.
const FILLER_KEY_BYTES: number = 12;

// The two `Read` results in this cut were half a megabyte each, and the size is the entire reason
// they're here — a line bigger than the tail window leaves that window with nothing parseable in
// it. The fixture records the size and the bytes are made up here, since the real ones were the
// developer's own source. An unknown key rides through the schema untouched, which is the point:
// what makes the line hard to read is its length, not its shape.
const transcriptLine = (row: FixtureRow): string => {
  const bare: string = JSON.stringify(row.line);
  if (row.padTo === undefined) return bare;

  const fill: number = row.padTo - bare.length - FILLER_KEY_BYTES;
  if (fill <= 0) return bare;
  return JSON.stringify({ ...row.line, filler: 'x'.repeat(fill) });
};

const lines: string[] = rows.map(transcriptLine);

let dir: string;
let path: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'claude-transcript-'));
  path = join(dir, 'session.jsonl');
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

// Metadata lines carry no timestamp of their own, so a prefix ending on one is as old as the last
// line that had one.
const writtenAt = (index: number): number => {
  for (let i = index; i >= 0; i -= 1) {
    const stamp: string | undefined = rows[i].line.timestamp;
    if (stamp) return Date.parse(stamp);
  }
  return 0;
};

// The file as it stood after this line was written, read the way the panel reads it.
const summaryAt = async (index: number): Promise<TranscriptSummary> => {
  await writeFile(path, `${lines.slice(0, index + 1).join('\n')}\n`, 'utf8');
  return readTranscript(path);
};

// The state a row would show if the panel read the log at this line and no later. `now` is the
// line's own timestamp, so the age is zero and nothing goes stale — this measures the turn rule,
// not the clock. The staleness path gets its own test below.
const stateAt = async (index: number): Promise<AgentActivity> => {
  const { tail } = await summaryAt(index);
  const at: number = writtenAt(index);
  return agentActivity({ tail, lastActivityAt: at, now: at });
};

const label = (index: number, state: AgentActivity): string =>
  `${FIRST_LINE + index} ${rows[index].line.type.padEnd(22)} ${state}`;

describe('readTranscript, over a recorded session line by line', () => {
  it('reads every prefix the way the annotated timeline says', async () => {
    const actual: string[] = [];
    for (let index = 0; index < rows.length; index += 1) {
      actual.push(label(index, await stateAt(index)));
    }
    const expected: string[] = rows.map((row, index) => label(index, row.expected));

    expect(actual).toEqual(expected);
  });

  // The session this was cut from: one prompt, then 126 seconds of work. 55 of those seconds read
  // Idle before this fix — five separate spans, from the two causes below.
  it('never reads idle between the prompt and the turn that answers it', async () => {
    // The prompt, not the tool results that are also `user` lines: a prompt carries text.
    const prompt: number = rows.findIndex(
      (row) => row.line.type === 'user' && hasBlock(row, 'text')
    );
    const idle: number[] = [];

    for (let index = prompt; index < rows.length - 1; index += 1) {
      if ((await stateAt(index)) === 'idle') idle.push(FIRST_LINE + index);
    }

    expect(idle).toEqual([]);
  });
});

describe('a line bigger than the tail window', () => {
  // The window is 64KB and this line is 505KB, so the window lands entirely inside it: the one line
  // it holds is torn in half and drops out, leaving nothing to read. The walk-back used to return
  // `settled` for that, which is how a working agent read Idle for the 14 seconds until the next
  // assistant line was written.
  const oversized = (): number => rows.findIndex((row) => row.padTo !== undefined);

  it('is stepped over rather than read as a finished turn', async () => {
    const index: number = oversized();
    expect(rows[index].padTo).toBeGreaterThan(64 * 1024);

    const { tail, pendingTool } = await summaryAt(index);
    expect(tail).toBe('working');
    // No tool named, and that's the right answer rather than a gap: this line *is* the result, so
    // the call it answers is finished and the model is working with what came back.
    expect(pendingTool).toBeUndefined();
  });

  it('still reports the fields written before it', async () => {
    const index: number = oversized();
    const summary: TranscriptSummary = await summaryAt(index);

    expect(summary.context?.tokens).toBeGreaterThan(0);
    expect(summary.pullRequest?.number).toBeDefined();
  });

  // The eight metadata lines the CLI writes after a tool result — a title, a prompt echo, a PR
  // link. None of them is a message, so the window is still blind for every one of them.
  it('keeps reading the turn through the metadata written after it', async () => {
    const index: number = oversized();
    for (let after = index; after < index + 8; after += 1) {
      expect(await stateAt(after)).toBe('running');
    }
  });
});

describe('a text-only assistant line', () => {
  const stopReasonAt = (index: number): string | null | undefined =>
    rows[index].line.message?.stop_reason;

  // One response is written as several lines — the thinking, the prose, then the tool call — and
  // every one of them carries the reason the whole response ended. So the prose line is text-only
  // and mid-turn, which is indistinguishable from a finished turn by the blocks alone.
  it('is mid-turn when its stop reason says a tool call is coming', async () => {
    const index: number = rows.findIndex(
      (row, at) => stopReasonAt(at) === 'tool_use' && isTextOnly(row)
    );
    expect(index).toBeGreaterThan(-1);

    const { tail, pendingTool } = await summaryAt(index);
    expect(tail).toBe('working');
    // The tool call is on the *next* line, so there is nothing to name yet. A row that says Working
    // without naming a tool is all the log supports at this moment.
    expect(pendingTool).toBeUndefined();
  });

  it('ends the turn when its stop reason says the model stopped', async () => {
    const index: number = rows.length - 1;
    expect(stopReasonAt(index)).toBe('end_turn');
    expect((await summaryAt(index)).tail).toBe('settled');
  });
});

// A response cut off mid-stream carries no stop reason at all — nine lines in 17,007 measured. The
// rule falls back to the shape of the blocks there, which is what it was before this fix.
describe('with no stop reason to read', () => {
  const write = async (line: object): Promise<TranscriptSummary> => {
    const file: string = join(dir, 'fallback.jsonl');
    await writeFile(file, `${JSON.stringify(line)}\n`, 'utf8');
    return readTranscript(file);
  };

  it('reads text alone as a finished turn', async () => {
    const summary: TranscriptSummary = await write({
      type: 'assistant',
      message: { model: 'claude-opus-5', content: [{ type: 'text', text: 'done' }] }
    });
    expect(summary.tail).toBe('settled');
  });

  it('reads a tool call as a turn still going', async () => {
    const summary: TranscriptSummary = await write({
      type: 'assistant',
      message: { model: 'claude-opus-5', content: [{ type: 'tool_use', name: 'Bash' }] }
    });
    expect(summary.tail).toBe('working');
    expect(summary.pendingTool).toBe('Bash');
  });
});

describe('the clock, which the rule above never consults', () => {
  it('calls a turn that stopped being written blocked rather than running', async () => {
    const index: number = rows.length - 2;
    const { tail } = await summaryAt(index);
    const at: number = writtenAt(index);

    expect(agentActivity({ tail, lastActivityAt: at, now: at })).toBe('running');
    expect(agentActivity({ tail, lastActivityAt: at, now: at + STALE_AFTER_MS + 1 })).toBe('blocked');
  });
});

const blocksOf = (row: FixtureRow): { type?: string }[] => {
  const content: unknown = row.line.message?.content;
  return Array.isArray(content) ? (content as { type?: string }[]) : [];
};

const hasBlock = (row: FixtureRow, type: string): boolean =>
  blocksOf(row).some((block) => block.type === type);

const isTextOnly = (row: FixtureRow): boolean => {
  const blocks: { type?: string }[] = blocksOf(row);
  return blocks.length > 0 && blocks.every((block) => block.type === 'text');
};
