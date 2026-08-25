import { AgentSession } from '../../model/types';
import { ActivityBadge } from '../ActivityBadge';
import { activityOf } from '../agent-activity';
import { useNow } from '../useNow';

// How often the badge re-reads the clock. The Active Agents list's tick, for its reason: a `working`
// tail becomes Waiting on a threshold, so the state moves without the disk moving.
const TICK_MS: number = 1000;

interface SessionActivityProps {
  agent: AgentSession;
}

// The badge on a session an agent is still writing to — which is also the sign that the numbers on
// this page are moving on their own. Mounted only when there is such an agent, so the clock exists
// only while something reads it.
export const SessionActivity = ({ agent }: SessionActivityProps) => {
  const now: number = useNow(TICK_MS);

  return <ActivityBadge activity={activityOf({ agent, now })} tail={agent.tail} />;
};
