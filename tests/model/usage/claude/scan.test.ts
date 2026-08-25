import { describe, expect, it } from 'vitest';
import { parseClaudeTurns } from '@src/model/usage/claude/scan';
import { UsageTurn } from '@src/model/usage/types';

// The claim under test: one API request is one turn, however many lines the CLI wrote it as. An
// assistant reply carrying a thinking block and two tool calls lands as three lines, and every one
// of them repeats the *whole* request's usage — so counting lines bills the request three times.
// Measured on a real session: 273 assistant lines, 167 requests, $41.25 read against $24.42 paid.

const AT: string = '2026-08-24T21:00:00.000Z';

interface LineArgs {
  requestId: string;
  timestamp?: string;
  // What this line of the reply holds. Only the usage is repeated across a request's lines; the
  // content blocks are split between them.
  content?: unknown[];
  model?: string;
  output?: number;
  cacheRead?: number;
}

// One transcript line, with the fields a turn is keyed on and nothing else.
const line = ({
  requestId,
  timestamp = AT,
  content = [{ type: 'text', text: 'hi' }],
  model = 'claude-opus-5',
  output = 100,
  cacheRead = 50_000
}: LineArgs): string =>
  JSON.stringify({
    type: 'assistant',
    requestId,
    sessionId: 'session-1',
    cwd: '/repo',
    timestamp,
    message: {
      id: 'msg_1',
      model,
      content,
      usage: {
        input_tokens: 4,
        output_tokens: output,
        cache_read_input_tokens: cacheRead,
        cache_creation_input_tokens: 0
      }
    }
  });

const idsOf = (turns: UsageTurn[]): string[] => turns.map((turn) => turn.id);

describe('parseClaudeTurns', () => {
  it('collapses the lines of one request into one turn', () => {
    const turns: UsageTurn[] = parseClaudeTurns([
      line({ requestId: 'req_a', content: [{ type: 'thinking', thinking: '…' }] }),
      line({ requestId: 'req_a', content: [{ type: 'tool_use', name: 'Bash' }] }),
      line({ requestId: 'req_a', content: [{ type: 'tool_use', name: 'Bash' }] })
    ]);

    expect(turns).toHaveLength(1);
    expect(turns[0].tokens.output).toBe(100);
    expect(turns[0].tokens.cacheRead).toBe(50_000);
  });

  it('keeps every distinct request, in the order the file wrote them', () => {
    const turns: UsageTurn[] = parseClaudeTurns([
      line({ requestId: 'req_a' }),
      line({ requestId: 'req_a' }),
      line({ requestId: 'req_b' }),
      line({ requestId: 'req_c' }),
      line({ requestId: 'req_c' }),
      line({ requestId: 'req_c' })
    ]);

    expect(idsOf(turns)).toEqual(['req_a', 'req_b', 'req_c']);
  });

  // The whole point of the fix, stated as the number a session page reads.
  it('sums a repeated request once rather than once per line', () => {
    const lines: string[] = [
      line({ requestId: 'req_a', output: 300 }),
      line({ requestId: 'req_a', output: 300 }),
      line({ requestId: 'req_b', output: 700 })
    ];

    const total: number = parseClaudeTurns(lines).reduce(
      (sum, turn) => sum + turn.tokens.output,
      0
    );

    expect(total).toBe(1_000);
  });

  // A repeat isn't always adjacent — the three lines of one request can have another request's
  // lines nowhere near them, and a walk that only compared neighbours would miss it.
  it('dedupes a request whose lines are not adjacent', () => {
    const turns: UsageTurn[] = parseClaudeTurns([
      line({ requestId: 'req_a' }),
      line({ requestId: 'req_b' }),
      line({ requestId: 'req_a' })
    ]);

    expect(idsOf(turns)).toEqual(['req_a', 'req_b']);
  });

  // Lines that aren't turns are dropped for their own reasons and can't be deduped at all — the id
  // a Set would hold is the missing field.
  it('drops lines with no requestId without disturbing the ones that have it', () => {
    const turns: UsageTurn[] = parseClaudeTurns([
      JSON.stringify({ type: 'assistant', sessionId: 'session-1', cwd: '/repo', timestamp: AT }),
      line({ requestId: 'req_a' }),
      'not json at all',
      line({ requestId: 'req_a' })
    ]);

    expect(idsOf(turns)).toEqual(['req_a']);
  });

  // The CLI writes its own notices as assistant lines with an all-zero usage block. They were
  // already skipped; the dedupe runs after that test, so a session full of them stays empty rather
  // than collapsing to one synthetic turn.
  it('still skips synthetic lines', () => {
    const turns: UsageTurn[] = parseClaudeTurns([
      line({ requestId: 'req_a', model: '<synthetic>' }),
      line({ requestId: 'req_b', model: '<synthetic>' })
    ]);

    expect(turns).toEqual([]);
  });
});
