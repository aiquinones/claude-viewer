import { describe, expect, it } from 'vitest';
import { parseCodexTurns } from '@src/model/usage/codex/scan';
import { contextPointsFromTurns } from '@src/model/usage/session/contexts';
import { CodexThread } from '@src/model/sessions/codex/threads-db';
import { ContextPoint, UsageTurn } from '@src/model/usage/types';
import session from '../../../fixtures/codex-usage-session.json';

// The rule under test is the conversion, not the reading: Codex states what a request cost, and what
// this has an opinion about is turning its inclusive counters into the disjoint ones `UsageTokens` is
// defined in, and finding the model on a line that isn't the one carrying the numbers.
//
// The fixture is a real session cut by `clean-codex-usage.mjs`, and it happens to contain the case
// worth having: the model changes partway through.

const thread: CodexThread = {
  threadId: 'thread-abc',
  rolloutPath: '/tmp/rollout.jsonl',
  cwd: '/repo',
  title: 'first line\nsecond line',
  // The *last* model the thread ran, which is what the column holds. A turn should only take this
  // when no `turn_context` has been seen yet.
  model: 'gpt-5.6-luna',
  branch: 'main',
  isSubagent: false,
  createdAt: 1,
  updatedAt: 2
};

const linesOf = (from: unknown[]): string[] => from.map((line) => JSON.stringify(line));

const turnsOf = (from: unknown[] = session): UsageTurn[] =>
  parseCodexTurns({ lines: linesOf(from), thread });

describe('parseCodexTurns', () => {
  it('yields one turn per token_count, oldest first', () => {
    const turns: UsageTurn[] = turnsOf();

    expect(turns).toHaveLength(8);
    expect(turns.map((turn) => turn.at)).toEqual([...turns.map((turn) => turn.at)].sort());
  });

  it('splits the prompt into disjoint counters that add back up to it', () => {
    const [first]: UsageTurn[] = turnsOf();

    // The line says input 14,697 of which 13,056 cached. Nothing to sum on the way in; everything
    // sums on the way out.
    expect(first.tokens).toEqual({
      input: 14697 - 13056,
      output: 125,
      cacheRead: 13056,
      cacheWrite5m: 0,
      cacheWrite1h: 0
    });

    const prompt: number =
      first.tokens.input +
      first.tokens.cacheRead +
      first.tokens.cacheWrite5m +
      first.tokens.cacheWrite1h;
    expect(prompt).toBe(14697);
  });

  it('counts a cache write inside the prompt rather than on top of it', () => {
    const [turn]: UsageTurn[] = turnsOf([
      { type: 'turn_context', timestamp: '2026-08-26T20:00:00.000Z', payload: { model: 'gpt-5' } },
      {
        type: 'event_msg',
        timestamp: '2026-08-26T20:00:01.000Z',
        ordinal: 3,
        payload: {
          type: 'token_count',
          info: {
            last_token_usage: {
              input_tokens: 1000,
              cached_input_tokens: 600,
              cache_write_input_tokens: 300,
              output_tokens: 50
            }
          }
        }
      }
    ]);

    expect(turn.tokens.input).toBe(100);
    expect(turn.tokens.cacheRead).toBe(600);
    expect(turn.tokens.cacheWrite5m).toBe(300);
    // No TTL is stated anywhere, so nothing may land in the hour bucket — that field is priced at
    // 60% more wherever cost is computed.
    expect(turn.tokens.cacheWrite1h).toBe(0);
  });

  it('reads the model per turn, so a session that switches is not folded onto one', () => {
    const models: string[] = turnsOf().map((turn) => turn.model);

    expect(models).toEqual([
      'gpt-5.6-terra',
      'gpt-5.6-terra',
      'gpt-5.6-terra',
      'gpt-5.6-terra',
      'gpt-5.6-terra',
      'gpt-5.6-luna',
      'gpt-5.6-luna',
      'gpt-5.6-luna'
    ]);
  });

  it("falls back to the thread's model for a chunk that starts past the turn_context", () => {
    // What an appended read looks like when the model was announced in bytes already consumed.
    const tail: unknown[] = (session as unknown[]).filter(
      (line) => (line as { type: string }).type !== 'turn_context'
    );

    expect(turnsOf(tail).every((turn) => turn.model === thread.model)).toBe(true);
  });

  it('keys a turn on the thread, not on the session id the rollout carries', () => {
    const turns: UsageTurn[] = turnsOf();

    // A sub-agent's rollout carries its *parent's* `session_meta.session_id`, so reading that would
    // bill the parent for the child's work and leave the child's own row unreachable.
    expect(turns.every((turn) => turn.sessionId === 'thread-abc')).toBe(true);
    expect(turns.every((turn) => turn.tool === 'codex')).toBe(true);
  });

  it('carries the working directory and branch off the thread', () => {
    const [turn]: UsageTurn[] = turnsOf();

    expect(turn.cwd).toBe('/repo');
    expect(turn.branch).toBe('main');
  });

  it('gives every turn a distinct id', () => {
    const ids: string[] = turnsOf().map((turn) => turn.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keys on the timestamp when the rollout predates ordinals', () => {
    const older: unknown[] = (session as unknown[]).map((line) => {
      const { ordinal, ...rest } = line as { ordinal?: number };
      return rest;
    });

    const ids: string[] = turnsOf(older).map((turn) => turn.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('skips a token_count carrying no counters', () => {
    // Older rollouts write `info: null` on the first one of a session rather than omitting the line.
    const turns: UsageTurn[] = turnsOf([
      { type: 'event_msg', timestamp: '2026-08-26T20:00:00.000Z', payload: { type: 'token_count', info: null } },
      { type: 'event_msg', timestamp: '2026-08-26T20:00:01.000Z', payload: { type: 'token_count' } }
    ]);

    expect(turns).toEqual([]);
  });

  it('skips a line that is torn or is not a rollout line at all', () => {
    expect(parseCodexTurns({ lines: ['', '{"type":"event_msg"', 'not json'], thread })).toEqual([]);
  });

  it('feeds the context series the whole prompt, once', () => {
    const points: ContextPoint[] = contextPointsFromTurns(turnsOf());

    // What the request carried, which is exactly what the line said its input was — the conversion
    // and this sum are the two halves of one claim, so they're asserted against the raw figure.
    expect(points).toHaveLength(8);
    expect(points[0].tokens).toBe(14697);
    expect(points[7].tokens).toBe(37149);
    expect(points[0].model).toBe('gpt-5.6-terra');
  });
});
