import { describe, expect, it } from 'vitest';
import { codexDeliverablesIn } from '@src/model/sessions/codex/deliverables';

const CWD: string = '/Users/dev/repos/example-app';
const MARKER: string = 'claude-viewer:deliverable';
const PAYLOAD: string = '{"type":"storybook","title":"Storybook","url":"http://localhost:6006"}';
const DECLARE: string = `echo '${MARKER} ${PAYLOAD}'`;

// The four shapes a real rollout wrote for one declaration, taken off a live Codex session.
const execLine = (command: string[]): string =>
  JSON.stringify({
    type: 'event_msg',
    payload: { type: 'item_completed', item: { type: 'CommandExecution', command } }
  });

const messageLine = (itemType: string, content: string): string =>
  JSON.stringify({
    type: 'event_msg',
    payload: { type: 'item_completed', item: { type: itemType, content } }
  });

// The same call in its other spelling: a JS snippet wrapping the command, double-escaped.
const customToolLine = (command: string): string =>
  JSON.stringify({
    type: 'response_item',
    payload: {
      type: 'custom_tool_call',
      name: 'exec',
      input: `const r = await tools.exec_command({cmd:${JSON.stringify(command)}}); text(r.output);`
    }
  });

const read = (lines: string[]) => codexDeliverablesIn({ lines, cwd: CWD });

describe('codexDeliverablesIn', () => {
  it('reads a declaration out of a CommandExecution', () => {
    expect(read([execLine(['/bin/zsh', '-lc', DECLARE])])).toEqual([
      { kind: 'storybook', title: 'Storybook', url: 'http://localhost:6006/' }
    ]);
  });

  // Joining rather than taking the last element, so a bare argv works too.
  it('reads a declaration from a bare argv', () => {
    expect(read([execLine(['echo', `${MARKER} ${PAYLOAD}`])])).toHaveLength(1);
  });

  it('ignores the marker in the prompt that asked for it', () => {
    expect(read([messageLine('UserMessage', `run ${MARKER} ${PAYLOAD}`)])).toEqual([]);
  });

  it('ignores the marker in the reply describing it', () => {
    expect(read([messageLine('AgentMessage', `I ran ${MARKER} ${PAYLOAD}`)])).toEqual([]);
  });

  // Codex logs one shell call twice. Reading both spellings would double every declaration, which
  // is why only the `event_msg` half is read — this is the line that proves it.
  it('reads one declaration from a log holding both spellings of the same call', () => {
    const lines: string[] = [customToolLine(DECLARE), execLine(['/bin/zsh', '-lc', DECLARE])];
    expect(read(lines)).toHaveLength(1);
  });

  it('ignores a marker written into a file', () => {
    const heredoc: string = `cat > docs/d.md <<'EOF'\n${MARKER} ${PAYLOAD}\nEOF`;
    expect(read([execLine(['/bin/zsh', '-lc', heredoc])])).toEqual([]);
  });

  it('skips lines that do not parse, and logs that declare nothing', () => {
    expect(read(['{"type":"event_msg","payl'])).toEqual([]);
    expect(read([execLine(['/bin/zsh', '-lc', 'pnpm run storybook'])])).toEqual([]);
  });
});
