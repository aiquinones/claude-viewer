import { useEffect, useRef } from 'react';
import { AgentSession } from '../../model/types';
import { agentLabel } from '../agent-row-text';
import { fileName } from '../display-path';
import { ActivityMemory, idleTransitions } from './idle-transitions';
import { ToastMessage } from './toast-message';

interface UseIdleToastsArgs {
  agents: AgentSession[];
  push: (message: ToastMessage) => void;
}

// The first producer: an agent that just finished what it was doing. Runs on the agents message
// rather than on a clock, because idle means the transcript settled and that only ever changes when
// the host posts a new read — the one-second tick the rows run on can't reach it.
export const useIdleToasts = ({ agents, push }: UseIdleToastsArgs): void => {
  const memory = useRef<ActivityMemory | undefined>(undefined);

  useEffect(() => {
    const { memory: next, became } = idleTransitions({
      previous: memory.current,
      agents,
      now: Date.now()
    });
    memory.current = next;
    for (const agent of became) push(idleToast(agent));
  }, [agents, push]);
};

// A session reads here the way it reads on its row — same name, same folder — so the card and the
// list can't disagree about which session this is.
const idleToast = (agent: AgentSession): ToastMessage => ({
  title: agentLabel(agent),
  detail: `Went idle in ${fileName(agent.cwd)}`,
  tool: agent.tool,
  sessionId: agent.sessionId
});
