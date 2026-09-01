import { describe, expect, it } from 'vitest';
import { AgentSession } from '@src/model/types';
import {
  ActivityMemory,
  IDLE_NOTICE_WINDOW_MS,
  idleTransitions
} from '@src/webview/toasts/idle-transitions';

// The whole trigger rule for the notification stack. What earns a test is that every case here is
// a card that shouldn't appear: a session sitting idle since before the panel opened, one seen for
// the first time, one that finished while the panel was hidden. Each of those looks like a
// transition from the wrong angle, and none of them is one.

const NOW: number = 1_770_000_000_000;

const agent = (overrides: Partial<AgentSession> & Pick<AgentSession, 'sessionId'>): AgentSession => ({
  tool: 'claude',
  otherPids: [],
  cwd: '/Users/dev/repos/example-app',
  transcriptPath: `/Users/dev/.claude/projects/example/${overrides.sessionId}.jsonl`,
  tail: 'settled',
  lastActivityAt: NOW - 5_000,
  startedAt: NOW - 600_000,
  version: '2.1.227',
  entrypoint: 'claude-vscode',
  issues: [],
  ...overrides
});

// A log that ends mid-turn and was written a moment ago: running, by the same rule the rows use.
const working = (sessionId: string): AgentSession =>
  agent({ sessionId, tail: 'working', lastActivityAt: NOW - 5_000 });

const settled = (sessionId: string, lastActivityAt: number = NOW - 5_000): AgentSession =>
  agent({ sessionId, tail: 'settled', lastActivityAt });

const idsOf = (agents: AgentSession[]): string[] => agents.map((each) => each.sessionId);

describe('idleTransitions', () => {
  it('reports a session that crossed from working to idle', () => {
    const first = idleTransitions({ previous: undefined, agents: [working('a')], now: NOW });
    const second = idleTransitions({ previous: first.memory, agents: [settled('a')], now: NOW });

    expect(idsOf(second.became)).toEqual(['a']);
  });

  it('reports a session that crossed from waiting to idle', () => {
    const previous: ActivityMemory = { a: 'blocked' };
    const { became } = idleTransitions({ previous, agents: [settled('a')], now: NOW });

    expect(idsOf(became)).toEqual(['a']);
  });

  // The first message carries every session on the machine, most of them long since finished.
  it('reports nothing on the first pass, whatever state the sessions are in', () => {
    const { became, memory } = idleTransitions({
      previous: undefined,
      agents: [settled('a'), working('b')],
      now: NOW
    });

    expect(became).toEqual([]);
    expect(memory).toEqual({ a: 'idle', b: 'running' });
  });

  it('says nothing about a session that was already idle', () => {
    const previous: ActivityMemory = { a: 'idle' };
    const { became } = idleTransitions({ previous, agents: [settled('a')], now: NOW });

    expect(became).toEqual([]);
  });

  // New to us is not a change: a session that started elsewhere and finished before the panel
  // first saw it has nothing to announce.
  it('says nothing about a session seen for the first time', () => {
    const previous: ActivityMemory = { a: 'running' };
    const { became } = idleTransitions({ previous, agents: [settled('b')], now: NOW });

    expect(became).toEqual([]);
  });

  // Polling stops while the panel is hidden, so coming back delivers every change at once.
  it('says nothing about a log that settled long ago', () => {
    const previous: ActivityMemory = { a: 'running' };
    const stale: AgentSession = settled('a', NOW - IDLE_NOTICE_WINDOW_MS - 1);
    const { became } = idleTransitions({ previous, agents: [stale], now: NOW });

    expect(became).toEqual([]);
  });

  it('still reports one that settled inside the window', () => {
    const previous: ActivityMemory = { a: 'running' };
    const fresh: AgentSession = settled('a', NOW - IDLE_NOTICE_WINDOW_MS + 1_000);
    const { became } = idleTransitions({ previous, agents: [fresh], now: NOW });

    expect(idsOf(became)).toEqual(['a']);
  });

  it('forgets a session that dropped off the list', () => {
    const previous: ActivityMemory = { a: 'running', b: 'running' };
    const { memory } = idleTransitions({ previous, agents: [working('a')], now: NOW });

    expect(memory).toEqual({ a: 'running' });
  });

  // Which is what makes a resumed session a first sighting rather than a transition — it comes back
  // against a memory that no longer holds it.
  it('says nothing when a forgotten session comes back idle', () => {
    const previous: ActivityMemory = { a: 'running' };
    const gone = idleTransitions({ previous, agents: [], now: NOW });
    const back = idleTransitions({ previous: gone.memory, agents: [settled('a')], now: NOW });

    expect(back.became).toEqual([]);
  });

  it('reports every session that crossed in the same message', () => {
    const previous: ActivityMemory = { a: 'running', b: 'blocked', c: 'running' };
    const { became } = idleTransitions({
      previous,
      agents: [settled('a'), settled('b'), working('c')],
      now: NOW
    });

    expect(idsOf(became)).toEqual(['a', 'b']);
  });
});
