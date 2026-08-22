// The strings every agent row prints, wherever it's drawn. Shared by the dense row and the robot
// one so a session reads the same in both.

import { AgentSession } from '../model/types';
import { fileName } from './display-path';
import { plural } from './format-size';

// Both CLIs name the session themselves. Before one has, the last prompt says more than the session
// id ever would; failing both, the folder does.
export const agentLabel = (agent: AgentSession): string =>
  agent.title ?? agent.lastPrompt ?? fileName(agent.cwd);

// What the red flag says when more than one live process holds one session: how many, and which.
// The row's own pid isn't in the list — that one is the row.
export const duplicatePidNote = (agent: AgentSession): string =>
  `${plural(
    agent.otherPids.length,
    'extra process holds',
    'extra processes hold'
  )} this session: ${agent.otherPids.join(', ')}`;
