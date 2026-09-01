import { describe, expect, it } from 'vitest';
import { copilotDeliverablesIn } from '@src/model/sessions/copilot/deliverables';

const CWD: string = '/Users/dev/repos/example-app';
const MARKER: string = 'claude-viewer:deliverable';
const PAYLOAD: string = '{"type":"storybook","title":"Storybook","url":"http://localhost:6006"}';
const DECLARE: string = `echo '${MARKER} ${PAYLOAD}'`;

// The shapes a real Copilot event log wrote for one declaration.
const toolLine = (toolName: string, command: string): string =>
  JSON.stringify({
    type: 'tool.execution_start',
    data: { toolCallId: 'toolu_01', toolName, arguments: { command, description: 'Run it' } }
  });

const messageLine = (type: string, text: string): string =>
  JSON.stringify({ type, data: { content: text } });

const read = (lines: string[]) => copilotDeliverablesIn({ lines, cwd: CWD });

describe('copilotDeliverablesIn', () => {
  it('reads a declaration out of a bash tool call', () => {
    expect(read([toolLine('bash', DECLARE)])).toEqual([
      { kind: 'storybook', title: 'Storybook', url: 'http://localhost:6006/' }
    ]);
  });

  it('ignores the marker in the prompt that asked for it', () => {
    expect(read([messageLine('user.message', `run ${MARKER} ${PAYLOAD}`)])).toEqual([]);
  });

  it('ignores the marker in the reply describing it', () => {
    expect(read([messageLine('assistant.message', `I ran ${MARKER} ${PAYLOAD}`)])).toEqual([]);
  });

  // The echo's own output comes back on this event, marker and all.
  it('ignores the marker in the tool output', () => {
    const done: string = JSON.stringify({
      type: 'tool.execution_complete',
      data: { toolName: 'bash', result: `${MARKER} ${PAYLOAD}` }
    });
    expect(read([done])).toEqual([]);
  });

  it('ignores a command belonging to another tool', () => {
    expect(read([toolLine('str_replace_editor', DECLARE)])).toEqual([]);
  });

  it('ignores a marker written into a file', () => {
    expect(read([toolLine('bash', `cat > d.md <<'EOF'\n${MARKER} ${PAYLOAD}\nEOF`)])).toEqual([]);
  });

  it('skips lines that do not parse, and logs that declare nothing', () => {
    expect(read(['{"type":"tool.execution_st'])).toEqual([]);
    expect(read([toolLine('bash', 'pnpm run storybook')])).toEqual([]);
  });
});
