import { describe, expect, it } from 'vitest';
import { CopilotEvent, parseEvent } from '@src/model/sessions/copilot/event-schema';
import { copilotTail } from '@src/model/sessions/copilot/events';
import { runningSubagents } from '@src/model/sessions/copilot/subagents';
import { Subagent } from '@src/model/types';

// Synthetic events in the shape a real log writes them — the fields this rule reads and nothing
// else, the same way the usage grid's test builds its own sessions. Every event goes through
// `parseEvent`, so the schema is under test too.
const parsed = (event: object): CopilotEvent => {
  const value: CopilotEvent | undefined = parseEvent(JSON.stringify(event));
  if (!value) throw new Error(`event failed to parse: ${JSON.stringify(event)}`);
  return value;
};

const task = (toolCallId: string, description: string): object => ({
  type: 'tool.execution_start',
  data: { toolName: 'task', toolCallId, arguments: { description, agent_type: 'general-purpose' } }
});

const started = (toolCallId: string): object => ({
  type: 'subagent.started',
  data: {
    toolCallId,
    agentName: 'general-purpose',
    agentDisplayName: 'General Purpose Agent',
    model: 'gpt-5.6-luna'
  }
});

const completed = (toolCallId: string): object => ({
  type: 'subagent.completed',
  data: { toolCallId, agentName: 'general-purpose', model: 'gpt-5.6-luna' }
});

// Two sub-agents started and finished inside one turn, with one of them running a tool of its own
// in between — the shape a real session has.
const SESSION: object[] = [
  { type: 'user.message', data: { content: 'go' } },
  { type: 'assistant.turn_start' },
  task('call_a', 'Read the loaders'),
  started('call_a'),
  task('call_b', 'Sweep the stories'),
  started('call_b'),
  {
    type: 'tool.execution_start',
    data: {
      toolName: 'bash',
      toolCallId: 'call_inner',
      parentToolCallId: 'call_a',
      arguments: { command: 'ls', description: 'List the folder' }
    }
  },
  { type: 'tool.execution_complete', data: { toolCallId: 'call_inner' } },
  completed('call_a'),
  completed('call_b'),
  { type: 'assistant.turn_end' }
];

const events: CopilotEvent[] = SESSION.map(parsed);

const runningAt = (index: number): Subagent[] => runningSubagents(events.slice(0, index + 1));

describe('runningSubagents, over a session line by line', () => {
  // A poll can land between any two lines, so every prefix has an answer. The count rises as each
  // one is started and falls as each is completed — the middle is where the rule earns its keep, and
  // asserting only the finished session would pass with no rule at all.
  it('counts the sub-agents still out at every line', () => {
    const counts: number[] = SESSION.map((_, index) => runningAt(index).length);

    expect(counts).toEqual([0, 0, 0, 1, 1, 2, 2, 2, 1, 0, 0]);
  });

  // They pair by id, not by position: Copilot runs sub-agents in parallel, so the one still out
  // after `call_a` completes is the one started second.
  it('keeps the one that has not completed, in start order', () => {
    expect(runningAt(8).map((subagent) => subagent.id)).toEqual(['call_b']);
    expect(runningAt(5).map((subagent) => subagent.id)).toEqual(['call_a', 'call_b']);
  });

  it('reads the purpose off the task call that started it', () => {
    expect(runningAt(5)).toEqual([
      {
        id: 'call_a',
        name: 'general-purpose',
        displayName: 'General Purpose Agent',
        purpose: 'Read the loaders',
        model: 'gpt-5.6-luna'
      },
      {
        id: 'call_b',
        name: 'general-purpose',
        displayName: 'General Purpose Agent',
        purpose: 'Sweep the stories',
        model: 'gpt-5.6-luna'
      }
    ]);
  });

  // The sub-agent's own tools carry a `description` too, and that one is the agent's work rather
  // than the purpose of a delegation. Only the `task` tool is read.
  it('does not take a purpose from any other tool', () => {
    const found: Subagent | undefined = runningAt(7).find((subagent) => subagent.id === 'call_a');

    expect(found?.purpose).toBe('Read the loaders');
  });

  // The window read starts mid-file, so the tail can open on a sub-agent that is already out.
  it('lists one whose task call fell outside the window, unlabelled', () => {
    const [subagent] = runningSubagents([parsed(started('call_a'))]);

    expect(subagent.purpose).toBeUndefined();
    expect(subagent.id).toBe('call_a');
  });

  // The other end of the same window: a completion whose start is behind the window says nothing
  // is running, and must not invent a row.
  it('invents nothing from a completion with no start behind it', () => {
    expect(runningSubagents([parsed(completed('call_a'))])).toEqual([]);
  });

  it('skips a started event with no tool call id', () => {
    expect(runningSubagents([parsed({ type: 'subagent.started', data: { model: 'x' } })])).toEqual(
      []
    );
  });
});

// `arguments` is whatever the tool wrote, and a tool that puts a non-object there must not take the
// line down with it — `copilotTail` reads the same events, and a dropped `tool.execution_start` is
// a working agent reported as idle.
describe('a tool.execution_start whose arguments are not an object', () => {
  const line: CopilotEvent = parsed({
    type: 'tool.execution_start',
    data: { toolName: 'bash', toolCallId: 'call_x', arguments: 'ls -la' }
  });

  it('still parses, and still says a tool is out', () => {
    expect(copilotTail([line])).toEqual({ tail: 'working', pendingTool: 'bash' });
  });
});
