// Which sub-agents a session has out right now, off its event log. Pure — same seam `copilotTail`
// has, and what lets the test read it without a disk.

import { Subagent } from '../../types';
import { CopilotEvent } from './event-schema';

// The tool that starts a sub-agent. Its `arguments.description` is the purpose; no other tool's
// arguments are read here.
const TASK_TOOL: string = 'task';

// A sub-agent is running when its `subagent.started` has no `subagent.completed` behind it. Both
// events carry the same `toolCallId`, so they pair by id rather than by position — Copilot runs
// sub-agents in parallel, and a completed one can sit after a still-open one.
//
// The started event carries everything but the purpose, which is on the `task` tool call written a
// few milliseconds earlier. A sub-agent whose start scrolled out of the window read isn't listed:
// nothing in the window says it exists, and the alternative is inventing one from its inner tool
// calls.
export const runningSubagents = (events: CopilotEvent[]): Subagent[] => {
  const finished: Set<string> = new Set();
  const purposes: Map<string, string> = new Map();

  for (const event of events) {
    if (event.type === 'subagent.completed' && event.data?.toolCallId) {
      finished.add(event.data.toolCallId);
    }
    if (event.type === 'tool.execution_start' && event.data?.toolName === TASK_TOOL) {
      const purpose: string | undefined = event.data.arguments?.description;
      if (event.data.toolCallId && purpose) purposes.set(event.data.toolCallId, purpose);
    }
  }

  const running: Subagent[] = [];

  for (const event of events) {
    if (event.type !== 'subagent.started') continue;

    const id: string | undefined = event.data?.toolCallId;
    if (!id || finished.has(id)) continue;

    running.push({
      id,
      name: event.data?.agentName ?? '',
      displayName: event.data?.agentDisplayName,
      purpose: purposes.get(id),
      model: event.data?.model ?? ''
    });
  }

  return running;
};
