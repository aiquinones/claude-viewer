// The two strings every agent row prints, wherever it's drawn. Shared by the dense row and the
// robot one so a session reads the same in both.

import { AGENT_TOOL_LABEL, AgentSession } from '../model/types';
import { fileName } from './display-path';
import { plural } from './format-size';

// Both CLIs name the session themselves. Before one has, the last prompt says more than the session
// id ever would; failing both, the folder does.
export const agentLabel = (agent: AgentSession): string =>
  agent.title ?? agent.lastPrompt ?? fileName(agent.cwd);

// The identifying facts, none of which earn a place on the row itself. The repository is here
// rather than beside the branch: two agents in one repo is the normal case, so it says nothing the
// grouping hasn't already said.
export const agentTooltip = (agent: AgentSession): string =>
  [
    agent.transcriptPath,
    `pid ${agent.pid}`,
    agent.version ? `${AGENT_TOOL_LABEL[agent.tool]} ${agent.version}` : AGENT_TOOL_LABEL[agent.tool],
    agent.repository
  ]
    .filter((part): part is string => Boolean(part))
    .join('\n');

// What the red flag says when more than one live process holds one session. Three things, in the
// order you'd ask them: how many, why that happens, and which one this row is — because the menu's
// Kill acts on that pid alone and leaves the others running.
export const duplicatePidNote = (agent: AgentSession): string =>
  [
    `${plural(agent.otherPids.length, 'other process holds', 'other processes hold')} this session`,
    `(pid ${agent.otherPids.join(', ')}).`,
    'Resuming a conversation starts a new process and leaves the one it was opened from alive.',
    `This row is pid ${agent.pid}, and that's the one Kill ends.`
  ].join(' ');
