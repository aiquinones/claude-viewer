import { appendFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CopilotPrCache,
  newCopilotPrCache,
  pruneCopilotPrCache,
  readCopilotPullRequest
} from '@src/model/sessions/copilot/pull-request';
import { AgentPullRequest } from '@src/model/types';

// The scan reads a file, so these write one. Synthetic throughout: the shapes below are what a real
// log's lines look like, not lines cut from one.
let dir: string = '';
let path: string = '';
let cache: CopilotPrCache = newCopilotPrCache();

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'copilot-pr-'));
  path = join(dir, 'events.jsonl');
  cache = newCopilotPrCache();
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const PR_URL: string = 'https://github.com/acme/widgets/pull/89';

// One `tool.execution_complete`, carrying whatever the command printed.
const toolResult = (content: string): string =>
  JSON.stringify({
    type: 'tool.execution_complete',
    data: { toolCallId: 'call_1', result: { content } }
  });

const message = (content: string): string =>
  JSON.stringify({ type: 'assistant.message', data: { content } });

const turnEnd: string = JSON.stringify({ type: 'assistant.turn_end', data: {} });

// A log always ends in a newline; a line without one is half a line the writer hasn't finished.
const write = async (lines: string[]): Promise<void> => {
  await writeFile(path, lines.map((line) => `${line}\n`).join(''), 'utf8');
};

const append = async (lines: string[]): Promise<void> => {
  await appendFile(path, lines.map((line) => `${line}\n`).join(''), 'utf8');
};

const scan = (): Promise<AgentPullRequest | undefined> => readCopilotPullRequest({ path, cache });

describe('readCopilotPullRequest', () => {
  it('reads the line `gh pr create` prints', async () => {
    await write([turnEnd, toolResult(`${PR_URL}\n<shellId: 25 completed with exit code 0>`)]);

    expect(await scan()).toEqual({ number: 89, url: PR_URL });
  });

  // The command is usually chained onto a commit and a push, so the link lands under their output
  // rather than at the top of it.
  it('finds the link under the push output it was chained onto', async () => {
    const pushed: string = [
      '[feat/x 06bb59c] Simplify labels',
      ' 2 files changed, 6 insertions(+), 23 deletions(-)',
      "branch 'feat/x' set up to track 'origin/feat/x'.",
      PR_URL,
      '<shellId: 3 completed with exit code 0>'
    ].join('\n');

    await write([toolResult(pushed)]);

    expect(await scan()).toEqual({ number: 89, url: PR_URL });
  });

  it('takes the later PR when a session opens two', async () => {
    await write([
      toolResult(`https://github.com/acme/widgets/pull/12\n<shellId: 1 completed>`),
      turnEnd,
      toolResult(`${PR_URL}\n<shellId: 2 completed>`)
    ]);

    expect(await scan()).toEqual({ number: 89, url: PR_URL });
  });

  // The whole reason the match is a line of its own inside a tool's output. A link the model wrote,
  // or one sitting in a file it read, is a PR the session is talking about rather than one it opened.
  it('ignores a link the model wrote in a message', async () => {
    await write([message(`Implemented and opened PR [#89](${PR_URL}).`), turnEnd]);

    expect(await scan()).toBeUndefined();
  });

  it('ignores a link that shares its line with anything else', async () => {
    await write([
      toolResult(`{"url":"${PR_URL}","state":"OPEN"}`),
      toolResult(`See ${PR_URL} for the discussion`)
    ]);

    expect(await scan()).toBeUndefined();
  });

  // `git push` prints one of these on every branch that has no PR yet, and it names no number.
  it('ignores the create-a-pull-request hint a push prints', async () => {
    const hint: string = [
      'remote: Create a pull request for "feat/x" on GitHub by visiting:',
      'remote:      https://github.com/acme/widgets/pull/new/feat/x',
      'remote:'
    ].join('\n');

    await write([toolResult(hint)]);

    expect(await scan()).toBeUndefined();
  });

  it('has nothing to say about a log that does not exist', async () => {
    expect(await scan()).toBeUndefined();
    expect(cache.has(path)).toBe(false);
  });
});

describe('readCopilotPullRequest, across passes', () => {
  it('keeps what it found without reading the file again', async () => {
    await write([toolResult(`${PR_URL}\n<shellId: 1 completed>`)]);
    expect(await scan()).toEqual({ number: 89, url: PR_URL });

    const offset: number = cache.get(path)?.offset ?? 0;
    expect(offset).toBeGreaterThan(0);

    // Everything the PR is in sits behind the offset now, so this pass reads no bytes at all.
    await append([turnEnd]);
    expect(await scan()).toEqual({ number: 89, url: PR_URL });
  });

  it('finds a PR opened after the first pass', async () => {
    await write([turnEnd]);
    expect(await scan()).toBeUndefined();

    await append([toolResult(`${PR_URL}\n<shellId: 1 completed>`)]);
    expect(await scan()).toEqual({ number: 89, url: PR_URL });
  });

  // A shorter file is a different file. What was found in the old one describes a log that is gone.
  it('forgets a PR when the log is replaced by a shorter one', async () => {
    await write([turnEnd, turnEnd, toolResult(`${PR_URL}\n<shellId: 1 completed>`)]);
    expect(await scan()).toEqual({ number: 89, url: PR_URL });

    await write([turnEnd]);
    expect(await scan()).toBeUndefined();
  });
});

describe('pruneCopilotPrCache', () => {
  it('drops the logs that are no longer live', async () => {
    const gone: string = join(dir, 'gone.jsonl');
    const cached: CopilotPrCache = newCopilotPrCache();
    cached.set(path, { offset: 10 });
    cached.set(gone, { offset: 20 });

    pruneCopilotPrCache(cached, [path]);

    expect([...cached.keys()]).toEqual([path]);
  });
});
