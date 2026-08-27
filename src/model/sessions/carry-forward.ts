import { AgentSession } from '../types';

// What a row keeps when the next read can't see it any more.
//
// A transcript is read through a window at the end of the file, and three of the things a row shows
// are written further back than the turn is: a PR link is rewritten every few thousand lines, the
// context reading rides the last assistant line, and the last prompt is a metadata line after it.
// Anything large in between pushes them out — one pasted screenshot is a 57KB `user` line — and the
// row blanks a field the session still has. Measured over 45,697 prefixes of the transcripts on this
// machine: the context bar drops at 740 of them, the last prompt at 245, the PR link at 199.
//
// Widening the window doesn't fix it. `readTail` grows until the window holds a *turn*, which is a
// different question and is answered by lines the other three aren't on — so it stops as soon as the
// badge is right and leaves them short. Fixing each one that way means reading the file once per
// field, against a distance that has no bound: a session can run for thousands of lines between two
// PR-link rewrites.
//
// So they're carried instead, because each is a fact that stays true once it's written. A PR the
// session opened stays opened, a request that carried 280k tokens carried them, a prompt is the last
// one until a newer one appears. Absence from the window is evidence about the window rather than
// about the session, and a fresh reading always wins — the carry only ever fills a hole, so a second
// PR or a shrinking context can't be masked by one.
//
// `tail` is deliberately not carried, and neither is `pendingTool`. Those are claims about what the
// agent is doing *now*: carrying one would leave a finished session reading Working for as long as
// the panel stayed open, which is a worse bug than the one this fixes.
export const carryForward = (
  previous: readonly AgentSession[],
  next: readonly AgentSession[]
): AgentSession[] => {
  if (previous.length === 0) return [...next];

  const before: Map<string, AgentSession> = new Map(previous.map((session) => [key(session), session]));
  return next.map((session) => fill(before.get(key(session)), session));
};

// Keyed on the log as well as the session, because a resume moves a process onto another transcript
// while its session file still names the old conversation — an id alone could hand one session's PR
// link to another. A transcript that relocates loses the carry and reads again, which is the
// direction worth being wrong in.
const key = (session: AgentSession): string =>
  `${session.tool}:${session.sessionId}:${session.transcriptPath}`;

const fill = (before: AgentSession | undefined, session: AgentSession): AgentSession => {
  if (!before) return session;

  const carried: Partial<AgentSession> = {};
  if (!session.pullRequest && before.pullRequest) carried.pullRequest = before.pullRequest;
  if (!session.lastPrompt && before.lastPrompt) carried.lastPrompt = before.lastPrompt;
  if (!session.context && before.context) carried.context = before.context;

  return Object.keys(carried).length > 0 ? { ...session, ...carried } : session;
};
