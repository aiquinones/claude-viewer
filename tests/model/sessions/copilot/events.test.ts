import { describe, expect, it } from 'vitest';
import { agentActivity, STALE_AFTER_MS } from '@src/model/sessions/activity';
import { CopilotEvent, parseEvent } from '@src/model/sessions/copilot/event-schema';
import { copilotTail } from '@src/model/sessions/copilot/events';
import { AgentActivity } from '@src/model/types';
import sessionRows from '../../../fixtures/copilot-session.json';

// One row of the fixture: an event stripped to what the status rule reads, and the state a row
// should show once the log ends there. The `expected` values were reviewed by hand against the
// timeline — a poll can land between any two lines, so every prefix has an answer worth naming.
interface SessionRow {
  expected: AgentActivity;
  event: { type: string; timestamp?: string };
}

const rows: SessionRow[] = sessionRows as SessionRow[];

const parsed = (row: SessionRow): CopilotEvent => {
  const event: CopilotEvent | undefined = parseEvent(JSON.stringify(row.event));
  if (!event) throw new Error(`fixture row failed to parse: ${row.event.type}`);
  return event;
};

const events: CopilotEvent[] = rows.map(parsed);

// The state a row would show if the panel read the log at this line and no later. `now` is the
// line's own timestamp, so the age is zero and nothing goes stale — this measures the tail rule,
// not the clock. The staleness path gets its own test below.
const stateAt = (index: number): AgentActivity => {
  const now: number = Date.parse(rows[index].event.timestamp ?? '');
  const { tail } = copilotTail(events.slice(0, index + 1));
  return agentActivity({ tail, lastActivityAt: now, now });
};

const label = (index: number, state: AgentActivity): string =>
  `${String(index).padStart(3)} ${rows[index].event.type.padEnd(26)} ${state}`;

describe('copilotTail, over a recorded session line by line', () => {
  it('reads every prefix the way the annotated timeline says', () => {
    const actual: string[] = rows.map((_, index) => label(index, stateAt(index)));
    const expected: string[] = rows.map((row, index) => label(index, row.expected));

    expect(actual).toEqual(expected);
  });

  // The regression this fixture was cut for. Before `assistant.turn_start` and `assistant.message`
  // settled anything, the walk-back ran past a live turn to the *previous* `assistant.turn_end` and
  // called a working agent idle. It only showed from a session's second turn on, since the first
  // has no turn_end behind it to find — so the opening turn looked fine and the rest of the session
  // read Idle while the model wrote and ran tools.
  it('never reads idle between a turn opening and the turn ending', () => {
    const insideATurn: number[] = rows
      .map((_, index) => index)
      .filter((index) => opensBefore(index) && endsAfter(index));

    expect(insideATurn.length).toBeGreaterThan(80);
    expect(insideATurn.filter((index) => stateAt(index) === 'idle')).toEqual([]);
  });

  // A turn that ends mid-query is superseded by the next `assistant.turn_start` within 3ms, so the
  // walk-back reaches that first and the idle never surfaces. Measured over 8 real logs: not one of
  // 96 `assistant.turn_end` events was ever the last line of a file.
  it('settles on a turn_end only when the turn_end is the last word in the log', () => {
    const idleRows: number[] = rows
      .map((_, index) => index)
      .filter((index) => stateAt(index) === 'idle' && rows[index].event.type === 'assistant.turn_end');

    for (const index of idleRows) {
      const next = rows[index + 1];
      const settles: boolean = !next || SETTLING.includes(next.event.type);
      const gapMs: number = next ? at(index + 1) - at(index) : Infinity;

      // Either the query really is over, or the next line lands far inside one poll interval.
      expect(settles || gapMs < 100).toBe(true);
    }
  });

  it('names the tool a row is waiting on while one is still open', () => {
    // Five `view`/`rg` calls go out together and complete one by one; the row should name an
    // unfinished one throughout, not the one that just came back.
    for (const index of [31, 32, 33, 34, 35, 36, 37, 38, 39]) {
      expect(copilotTail(events.slice(0, index + 1)).pendingTool).toBeDefined();
    }
    // The last one completes and the turn continues, so nothing is pending any more.
    expect(copilotTail(events.slice(0, 41)).pendingTool).toBeUndefined();
  });
});

// Three states this recording never reaches. Synthetic, and small enough to read as a sequence.
describe('copilotTail, on the states the recording never reaches', () => {
  it('settles an aborted turn, which leaves no turn_end behind it', () => {
    // Escape mid-turn: `abort` and the checkpoint land, and the turn is never closed. Without
    // either of them decisive the walk-back finds `assistant.turn_start` and reports a cancelled
    // query as Working — for as long as the session stays open.
    const aborted: CopilotEvent[] = synthetic([
      { type: 'user.message', data: { content: 'go' } },
      { type: 'assistant.turn_start' },
      { type: 'assistant.message' },
      { type: 'assistant.turn_end' },
      { type: 'assistant.turn_start' },
      { type: 'abort', data: { reason: 'user_initiated' } },
      { type: 'session.usage_checkpoint' }
    ]);

    expect(copilotTail(aborted).tail).toBe('settled');
    expect(copilotTail(aborted.slice(0, -1)).tail).toBe('settled');
  });

  it('reads a permission prompt as blocked, and its answer as back to work', () => {
    const asking: CopilotEvent[] = synthetic([
      { type: 'user.message', data: { content: 'go' } },
      { type: 'assistant.turn_start' },
      { type: 'tool.execution_start', data: { toolCallId: 'call-1', toolName: 'bash' } },
      { type: 'permission.requested', data: { requestId: 'req-1', toolName: 'bash' } }
    ]);

    expect(copilotTail(asking)).toEqual({ tail: 'blocked', pendingTool: 'bash' });

    const answered: CopilotEvent[] = [
      ...asking,
      ...synthetic([{ type: 'permission.completed', data: { requestId: 'req-1' } }])
    ];
    expect(copilotTail(answered)).toEqual({ tail: 'working', pendingTool: 'bash' });
  });

  it('claims nothing about a window holding no turn at all', () => {
    expect(copilotTail([]).tail).toBe('settled');
    expect(copilotTail(synthetic([{ type: 'session.model_change' }])).tail).toBe('settled');
  });
});

// The clock's own half of the rule, which the line-by-line pass deliberately holds still.
describe('agentActivity over a copilot tail', () => {
  it('turns a working agent that has gone quiet into a waiting one', () => {
    const { tail } = copilotTail(events.slice(0, 43));
    expect(tail).toBe('working');

    const wroteAt: number = at(42);
    expect(agentActivity({ tail, lastActivityAt: wroteAt, now: wroteAt })).toBe('running');
    expect(
      agentActivity({ tail, lastActivityAt: wroteAt, now: wroteAt + STALE_AFTER_MS + 1 })
    ).toBe('blocked');
  });

  it('leaves a settled agent idle however long ago it settled', () => {
    const { tail } = copilotTail(events.slice(0, 45));
    expect(tail).toBe('settled');
    expect(agentActivity({ tail, lastActivityAt: 0, now: STALE_AFTER_MS * 100 })).toBe('idle');
  });
});

// What a turn_end may be followed by and still mean the query is over.
const SETTLING: string[] = [
  'session.usage_checkpoint',
  'session.shutdown',
  'session.auto_mode_resolved',
  'system.message'
];

const at = (index: number): number => Date.parse(rows[index].event.timestamp ?? '');

const opensBefore = (index: number): boolean =>
  rows.slice(0, index + 1).some((row) => row.event.type === 'assistant.turn_start') &&
  lastIndexOf(index, 'assistant.turn_start') > lastIndexOf(index, 'assistant.turn_end');

const endsAfter = (index: number): boolean =>
  rows.slice(index + 1).some((row) => row.event.type === 'assistant.turn_end');

const lastIndexOf = (upTo: number, type: string): number => {
  for (let i = upTo; i >= 0; i -= 1) {
    if (rows[i].event.type === type) return i;
  }
  return -1;
};

// Round-tripped through the real parser so a fixture can't assert on a shape the loader rejects.
const synthetic = (raw: object[]): CopilotEvent[] =>
  raw.map((event, index) => {
    const parsedEvent: CopilotEvent | undefined = parseEvent(JSON.stringify(event));
    if (!parsedEvent) throw new Error(`synthetic event ${index} failed to parse`);
    return parsedEvent;
  });
