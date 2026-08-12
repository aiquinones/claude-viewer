import { AgentActivity, TranscriptTail } from '../types';

// How long a transcript can go unwritten mid-turn before the agent is called stalled rather than
// busy. No value is correct — a 30-second read is working, a 30-second edit is waiting on a
// permission prompt — which is why the row prints the age and the pending tool next to the badge
// instead of hiding them behind it.
export const STALE_AFTER_MS: number = 60_000;

interface AgentActivityArgs {
  tail: TranscriptTail;
  lastActivityAt: number;
  now: number;
}

// The one rule, kept pure and away from the disk so the webview can run it on a clock. That's what
// lets a row cross from running to blocked on its own, without a refresh or a second read.
export const agentActivity = ({ tail, lastActivityAt, now }: AgentActivityArgs): AgentActivity => {
  if (tail === 'settled') return 'idle';
  return now - lastActivityAt < STALE_AFTER_MS ? 'running' : 'blocked';
};
