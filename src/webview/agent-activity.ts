import { agentActivity } from '../model/sessions/activity';
import { AgentActivity, AgentSession, TranscriptTail } from '../model/types';

interface ActivityOfArgs {
  agent: AgentSession;
  now: number;
}

// The state of one agent, as of now. The rule itself is in model/, unchanged from what the host
// used to build the snapshot — the webview only supplies a fresher clock.
export const activityOf = ({ agent, now }: ActivityOfArgs): AgentActivity =>
  agentActivity({ tail: agent.tail, lastActivityAt: agent.lastActivityAt, now });

// "Running" is what the model calls it; "Working" is what a person reading a list of their own
// agents calls it.
export const ACTIVITY_LABEL: Record<AgentActivity, string> = {
  running: 'Working',
  blocked: 'Waiting',
  idle: 'Idle'
};

// Most of these are inferred from how the log ends, so each says what it's inferred from rather
// than stating it flat.
const ACTIVITY_NOTE: Record<AgentActivity, string> = {
  running: 'mid-turn, and the log is still being written',
  blocked: 'a tool call is out and nothing has been written since — a permission prompt, or a long command',
  idle: 'the last turn finished — this agent is waiting for you'
};

// The exception. A `blocked` tail is an unanswered permission request sitting in the log, which is
// the state itself rather than evidence for it — no clock, no threshold, no guessing. Only Copilot
// records that; saying so is the difference between a reading and a hunch.
const STATED_BLOCKED: string = 'stopped at a permission prompt, waiting for an answer';

interface ActivityNoteArgs {
  activity: AgentActivity;
  tail: TranscriptTail;
}

export const activityNote = ({ activity, tail }: ActivityNoteArgs): string =>
  tail === 'blocked' ? STATED_BLOCKED : ACTIVITY_NOTE[activity];
