import { describe, expect, it } from 'vitest';
import { carryForward } from '@src/model/sessions/carry-forward';
import { AgentSession } from '@src/model/types';

interface SessionArgs {
  id?: string;
  path?: string;
  pr?: number;
  prompt?: string;
  tokens?: number;
  tail?: AgentSession['tail'];
  pendingTool?: string;
}

// Only the fields the rule reads carry any meaning here; the rest are what a row needs to exist.
const session = ({ id = 'a', path = '/logs/a.jsonl', pr, prompt, tokens, tail = 'working', pendingTool }: SessionArgs): AgentSession => ({
  sessionId: id,
  tool: 'claude',
  otherPids: [],
  cwd: '/repo',
  transcriptPath: path,
  pullRequest: pr === undefined ? undefined : { number: pr, url: `https://example.invalid/pull/${pr}` },
  lastPrompt: prompt,
  tail,
  pendingTool,
  context: tokens === undefined ? undefined : { tokens, model: 'claude-opus-5' },
  lastActivityAt: 0,
  startedAt: 0,
  version: '',
  entrypoint: '',
  issues: []
});

describe('carryForward', () => {
  it('fills a field the next read could not see', () => {
    const before: AgentSession[] = [session({ pr: 94, prompt: 'flip the colors', tokens: 280_000 })];
    const [row] = carryForward(before, [session({})]);

    expect(row.pullRequest?.number).toBe(94);
    expect(row.lastPrompt).toBe('flip the colors');
    expect(row.context?.tokens).toBe(280_000);
  });

  it('never overwrites what the next read did see', () => {
    const before: AgentSession[] = [session({ pr: 94, prompt: 'first', tokens: 280_000 })];
    const [row] = carryForward(before, [session({ pr: 95, prompt: 'second', tokens: 12_000 })]);

    expect(row.pullRequest?.number).toBe(95);
    expect(row.lastPrompt).toBe('second');
    // A compaction shrinks the context, and a carry that won ties would hide it behind the peak.
    expect(row.context?.tokens).toBe(12_000);
  });

  // The whole reason this isn't a cache of the row. `tail` and the tool beside it are claims about
  // what the agent is doing now, so a finished session has to be allowed to say it finished.
  it('carries nothing about what the agent is doing', () => {
    const before: AgentSession[] = [session({ tail: 'working', pendingTool: 'Bash' })];
    const [row] = carryForward(before, [session({ tail: 'settled' })]);

    expect(row.tail).toBe('settled');
    expect(row.pendingTool).toBeUndefined();
  });

  it('keeps carrying across passes until a fresh value arrives', () => {
    let rows: AgentSession[] = [session({ pr: 94 })];
    for (let pass = 0; pass < 5; pass += 1) rows = carryForward(rows, [session({})]);

    expect(rows[0].pullRequest?.number).toBe(94);
  });

  // Resuming moves a process onto another transcript while its session file still names the old
  // conversation, so the id alone would hand one session's PR link to another. Losing the carry and
  // reading again is the direction worth being wrong in.
  it('does not carry across a transcript the session was not writing before', () => {
    const before: AgentSession[] = [session({ path: '/logs/a.jsonl', pr: 94 })];
    const [row] = carryForward(before, [session({ path: '/logs/b.jsonl' })]);

    expect(row.pullRequest).toBeUndefined();
  });

  it('leaves a session it has never seen alone', () => {
    const before: AgentSession[] = [session({ id: 'a', pr: 94 })];
    const [row] = carryForward(before, [session({ id: 'b' })]);

    expect(row.pullRequest).toBeUndefined();
  });

  it('drops a session that is no longer running rather than resurrecting it', () => {
    const before: AgentSession[] = [session({ id: 'a' }), session({ id: 'b', path: '/logs/b.jsonl' })];

    expect(carryForward(before, [session({ id: 'a' })]).map((row) => row.sessionId)).toEqual(['a']);
  });
});
