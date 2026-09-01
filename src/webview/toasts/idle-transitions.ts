import { AgentActivity, AgentSession } from '../../model/types';
import { activityOf } from '../agent-activity';

// How recently the log has to have settled for the change to be worth announcing. Agent polling is
// off while the panel is hidden, so coming back delivers every change at once — without this, an
// hour away would produce a card for every session that finished during it.
export const IDLE_NOTICE_WINDOW_MS: number = 2 * 60_000;

// What each session was doing the last time we looked, by session id.
export type ActivityMemory = Record<string, AgentActivity>;

interface IdleTransitionsArgs {
  // The last answer, or undefined on the first pass — which seeds and reports nothing.
  previous: ActivityMemory | undefined;
  agents: AgentSession[];
  now: number;
}

export interface IdleTransitions {
  memory: ActivityMemory;
  became: AgentSession[];
}

// Which sessions *became* idle since the last look. Four things make that a change rather than a
// state: a session already idle says nothing, a session seen here for the first time says nothing
// (including on the first pass of all, when every one of them is new), a session that dropped off
// the list is simply absent from the new memory — so a resumed one comes back as a first sighting —
// and a log that settled long ago is old news whatever the memory says.
//
// `blocked → idle` counts. Blocked is a tool call nobody answered or a stalled clock; the turn
// finishing is still the thing worth saying.
export const idleTransitions = ({
  previous,
  agents,
  now
}: IdleTransitionsArgs): IdleTransitions => {
  const memory: ActivityMemory = {};
  const became: AgentSession[] = [];

  for (const agent of agents) {
    const activity: AgentActivity = activityOf({ agent, now });
    memory[agent.sessionId] = activity;

    if (!previous || activity !== 'idle') continue;
    const before: AgentActivity | undefined = previous[agent.sessionId];
    if (before === undefined || before === 'idle') continue;
    if (now - agent.lastActivityAt > IDLE_NOTICE_WINDOW_MS) continue;
    became.push(agent);
  }

  return { memory, became };
};
