import { loadSessionDetail } from '../model/usage/session/load';
import { SessionDetail, SessionRef, SessionUsage } from '../model/usage/types';
import { cachedSessions, transcriptPathsFor } from './usage-history-store';

// What the session analysis surface reads, one session at a time. No cache: this is a couple of
// files opened because a row was clicked, where every other read on this surface is a scan over the
// machine that something has to keep. When to read it again is `session-detail-store.ts`.

// The session has to be one the history scan already found. Same rule `_openFile` and `copySessionId`
// follow — the webview names a row and the host decides what it can reach — so a stale panel can't
// point the loader at a directory nobody read.
export const requestSessionDetail = async ({
  sessionId,
  tool
}: SessionRef): Promise<SessionDetail> => {
  const known: SessionUsage | undefined = cachedSessions().find(
    (session) => session.sessionId === sessionId && session.tool === tool
  );

  if (!known) {
    return {
      sessionId,
      tool,
      turns: [],
      invocations: [],
      contexts: [],
      error: 'This session is no longer on record. Refresh and try again.'
    };
  }

  return loadSessionDetail({ sessionId, tool, transcriptPaths: transcriptPathsFor(sessionId) });
};
