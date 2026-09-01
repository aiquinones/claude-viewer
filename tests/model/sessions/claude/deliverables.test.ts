import { describe, expect, it } from 'vitest';
import { claudeDeliverablesIn } from '@src/model/sessions/claude/deliverables';

const CWD: string = '/Users/dev/repos/example-app';

const MARKER: string = 'claude-viewer:deliverable';
const PAYLOAD: string = '{"type":"storybook","title":"Storybook","url":"http://localhost:6006"}';

const bashLine = (command: string): string =>
  JSON.stringify({
    type: 'assistant',
    message: { content: [{ type: 'tool_use', name: 'Bash', input: { command } }] }
  });

const read = (lines: string[]) => claudeDeliverablesIn({ lines, cwd: CWD });

describe('claudeDeliverablesIn', () => {
  it('reads a declaration out of a Bash tool call', () => {
    expect(read([bashLine(`echo '${MARKER} ${PAYLOAD}'`)])).toEqual([
      { kind: 'storybook', title: 'Storybook', url: 'http://localhost:6006/' }
    ]);
  });

  // The case the whole rule exists for. The instructions file is full of examples, so an agent that
  // reads it puts the marker into the transcript — as a tool *result*, which declares nothing.
  it('ignores the marker in a tool result', () => {
    const result: string = JSON.stringify({
      type: 'user',
      message: {
        content: [{ type: 'tool_result', content: `Here is how: echo '${MARKER} ${PAYLOAD}'` }]
      }
    });

    expect(read([result])).toEqual([]);
  });

  // The same trap from the other side: a prompt is a bare string rather than a block array, and
  // pasting the syntax into one is not declaring anything.
  it('ignores the marker in a prompt', () => {
    const prompt: string = JSON.stringify({
      type: 'user',
      message: { content: `use ${MARKER} ${PAYLOAD} to announce it` }
    });

    expect(read([prompt])).toEqual([]);
  });

  it('ignores the marker in another tool call', () => {
    const write: string = JSON.stringify({
      type: 'assistant',
      message: {
        content: [
          { type: 'tool_use', name: 'Write', input: { content: `${MARKER} ${PAYLOAD}` } }
        ]
      }
    });

    expect(read([write])).toEqual([]);
  });

  it('ignores the marker in assistant prose', () => {
    const text: string = JSON.stringify({
      type: 'assistant',
      message: { content: [{ type: 'text', text: `I'll run ${MARKER} ${PAYLOAD}` }] }
    });

    expect(read([text])).toEqual([]);
  });

  // A tail read starts mid-file and the file is appended to while it's read, so both ends can be
  // torn. Skipped silently, the way every other reader over this file does it.
  it('skips lines that do not parse', () => {
    expect(read([`{"type":"assistant","mess`, bashLine(`echo '${MARKER} ${PAYLOAD}'`)])).toHaveLength(
      1
    );
  });

  it('reads declarations from several lines in order', () => {
    const first: string = bashLine(`echo '${MARKER} {"type":"link","title":"A","url":"https://a.test"}'`);
    const second: string = bashLine(`echo '${MARKER} {"type":"link","title":"B","url":"https://b.test"}'`);

    expect(read([first, second]).map((one) => one.title)).toEqual(['A', 'B']);
  });

  it('yields nothing for a log that never declares one', () => {
    expect(read([bashLine('pnpm run storybook'), bashLine('git status')])).toEqual([]);
  });
});
