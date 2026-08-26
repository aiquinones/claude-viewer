import { describe, expect, it } from 'vitest';
import { agentActivity, STALE_AFTER_MS } from '@src/model/sessions/activity';
import { codexTail } from '@src/model/sessions/codex/rollout';
import { RolloutLine, parseRolloutLine } from '@src/model/sessions/codex/rollout-schema';
import { AgentActivity } from '@src/model/types';
import sessionRows from '../../../fixtures/codex-session.json';

// One row of the fixture: a rollout line stripped to what the status rule reads, and the state a row
// should show once the log ends there. A poll can land between any two lines, so every prefix has an
// answer worth naming — and the bug this shape exists to catch only lives in the middle of a
// session, where asserting one final state would sail straight past it.
//
// `expected` comes from a forward pass over the same lines (a turn is open from `task_started` until
// `task_complete`), which is deliberately not the backward walk under test — see
// `clean-codex-rollout.mjs`. Those ages are all zero here, so nothing in this fixture goes stale.
interface SessionRow {
  expected: AgentActivity;
  line: { type: string; timestamp?: string; payload?: { type?: string } };
}

const rows: SessionRow[] = sessionRows as SessionRow[];

const parsed = (row: SessionRow): RolloutLine => {
  const line: RolloutLine | undefined = parseRolloutLine(JSON.stringify(row.line));
  if (!line) throw new Error(`fixture row failed to parse: ${row.line.type}`);
  return line;
};

const lines: RolloutLine[] = rows.map(parsed);

const kindOf = (row: SessionRow): string => `${row.line.type}/${row.line.payload?.type ?? ''}`;

// The state a row would show if the panel read the log at this line and no later. `now` is the
// line's own timestamp, so the age is zero and nothing goes stale — this measures the tail rule, not
// the clock. The staleness path gets its own test below.
const stateAt = (index: number): AgentActivity => {
  const now: number = Date.parse(rows[index].line.timestamp ?? '');
  const { tail } = codexTail(lines.slice(0, index + 1));
  return agentActivity({ tail, lastActivityAt: now, now });
};

const label = (index: number, state: AgentActivity): string =>
  `${String(index).padStart(3)} ${kindOf(rows[index]).padEnd(34)} ${state}`;

describe('codexTail, over a recorded session line by line', () => {
  it('reads every prefix the way the annotated timeline says', () => {
    const actual: string[] = rows.map((_, index) => label(index, stateAt(index)));
    const expected: string[] = rows.map((row, index) => label(index, row.expected));

    expect(actual).toEqual(expected);
  });

  // The regression this shape exists for, inherited from `copilotTail`: a backward walk that matches
  // only the lines meaning "done" runs past a live turn and lands on the *previous* `task_complete`,
  // calling a working agent idle. It hides in the opening turn, which has no earlier completion
  // behind it to find, and shows from the second turn on. This session has four turns.
  it('never reads idle between a turn opening and the turn ending', () => {
    const insideATurn: number[] = rows.map((_, index) => index).filter(turnOpenAt);

    expect(insideATurn.length).toBeGreaterThan(200);
    expect(insideATurn.filter((index) => stateAt(index) === 'idle')).toEqual([]);
  });

  // The session really does settle, four times — otherwise the test above passes on a rule that says
  // "working" unconditionally.
  it('reads idle at each completed turn', () => {
    const completions: number[] = rows
      .map((_, index) => index)
      .filter((index) => kindOf(rows[index]) === 'event_msg/task_complete');

    expect(completions).toHaveLength(4);
    for (const index of completions) expect(stateAt(index)).toBe('idle');
  });

  // A tool call with no output behind it is the agent working, and the tool's name is what the row
  // prints beside the badge. Matched by `call_id` rather than by position, since Codex can have more
  // than one call open.
  it('names the tool a still-open call is waiting on', () => {
    const openCall: number | undefined = rows
      .map((_, index) => index)
      .find(
        (index) =>
          kindOf(rows[index]) === 'response_item/custom_tool_call' &&
          stateAt(index) === 'running'
      );

    expect(openCall).toBeDefined();
    expect(codexTail(lines.slice(0, (openCall ?? 0) + 1)).pendingTool).toBe('exec');
  });

  // A call that has its output is finished, so the walk carries past it rather than reporting the
  // tool as pending forever.
  it('carries past a tool call whose output has landed', () => {
    const closed: number | undefined = rows
      .map((_, index) => index)
      .find((index) => kindOf(rows[index]) === 'response_item/custom_tool_call_output');

    expect(closed).toBeDefined();
    expect(codexTail(lines.slice(0, (closed ?? 0) + 1)).pendingTool).toBeUndefined();
  });
});

describe('codexTail, on the states this session never reaches', () => {
  const line = (type: string, payloadType: string, extra: object = {}): RolloutLine => {
    const parsedLine: RolloutLine | undefined = parseRolloutLine(
      JSON.stringify({ type, payload: { type: payloadType, ...extra } })
    );
    if (!parsedLine) throw new Error(`could not build ${type}/${payloadType}`);
    return parsedLine;
  };

  // An escaped turn is never closed by a `task_complete` — `turn_aborted` is the only thing said
  // about it. Without this clause the walk finds the `task_started` behind it and reports a
  // cancelled turn as working indefinitely.
  it('settles on an aborted turn, which no task_complete follows', () => {
    const aborted: RolloutLine[] = [
      line('event_msg', 'task_started'),
      line('response_item', 'custom_tool_call', { call_id: 'call_1', name: 'exec' }),
      line('event_msg', 'turn_aborted')
    ];

    expect(codexTail(aborted).tail).toBe('settled');
  });

  // A window that starts mid-file can hold nothing decisive at all. That reads as settled rather
  // than inventing a turn — the age beside the badge is what says the row is stale.
  it('settles on a window with nothing decisive in it', () => {
    expect(codexTail([]).tail).toBe('settled');
    expect(codexTail([line('event_msg', 'token_count')]).tail).toBe('settled');
  });

  // Codex writes no permission line, so unlike Copilot it can never read `blocked` off the log. A
  // Codex row waits the way a Claude one does — on the clock.
  it('never reads blocked, whatever the log holds', () => {
    const everyKind: string[] = [...new Set(rows.map(kindOf))];

    for (const index of rows.keys()) expect(codexTail(lines.slice(0, index + 1)).tail).not.toBe('blocked');
    expect(everyKind).not.toContain('event_msg/permission_requested');
  });
});

describe('a Codex row going stale', () => {
  // The clock is the only thing that moves a Codex row off Working, since nothing in its log states
  // that an agent is waiting on you.
  it('crosses from working to waiting on the age alone', () => {
    const openTurn: RolloutLine[] = lines.slice(0, 2);
    const { tail } = codexTail(openTurn);

    expect(tail).toBe('working');
    expect(agentActivity({ tail, lastActivityAt: 0, now: STALE_AFTER_MS - 1 })).toBe('running');
    expect(agentActivity({ tail, lastActivityAt: 0, now: STALE_AFTER_MS + 1 })).toBe('blocked');
  });
});

const SETTLING: string[] = ['event_msg/task_complete', 'event_msg/turn_aborted'];

// Whether a turn is open at this line: the nearest turn marker at or before it opened one. A much
// narrower rule than `codexTail`, which is the point — it looks at the four turn lines and nothing
// else, so it can't inherit the walk's mistakes.
const turnOpenAt = (index: number): boolean => {
  for (let i = index; i >= 0; i -= 1) {
    const kind: string = kindOf(rows[i]);
    if (kind === 'event_msg/task_started') return true;
    if (SETTLING.includes(kind)) return false;
  }
  return false;
};
