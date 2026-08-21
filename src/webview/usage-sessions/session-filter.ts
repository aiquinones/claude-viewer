// What a session is called, and which ones a query keeps. Pure.

import { SessionUsage } from '../../model/usage/types';
import { fileName } from '../display-path';

// The name a row shows. Claude's first `ai-title` or Copilot's `workspace.yaml` name, and the folder
// it ran in when it has neither — 4 of the 89 sessions measured here, all of them short.
export const sessionName = (session: SessionUsage): string =>
  session.title ?? fileName(session.cwd);

// Case-insensitive substring, over the name only. Not the subsequence matcher the spotlight uses:
// that one ranks a handful of skill names against a few keystrokes, where this is a filter over a
// list you can already see — typing "fix" and being shown "flow-index" would read as a bug.
export const filterSessions = (sessions: SessionUsage[], query: string): SessionUsage[] => {
  const needle: string = query.trim().toLowerCase();
  if (needle === '') return sessions;

  return sessions.filter((session) => sessionName(session).toLowerCase().includes(needle));
};
