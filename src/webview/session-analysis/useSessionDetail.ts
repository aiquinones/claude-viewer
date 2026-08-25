import { useEffect } from 'react';
import { SessionDetail, SessionRef, SessionUsage } from '../../model/usage/types';

interface UseSessionDetailArgs {
  session: SessionUsage;
  // The last reply the host sent, whichever session it was about.
  detail: SessionDetail | undefined;
  onWatch: (session?: SessionRef) => void;
}

// One session's turns and skill loads, asked for on mount and dropped when it isn't the answer to
// the question being asked. Same shape as `useFileBody`: the reply carries what it's about, so a
// read that lands after you've gone back to the list is ignored rather than rendered.
export const useSessionDetail = ({
  session,
  detail,
  onWatch
}: UseSessionDetailArgs): SessionDetail | undefined => {
  useEffect(() => {
    onWatch({ sessionId: session.sessionId, tool: session.tool });
    // Clearing on the way out is what stops the host re-reading the file. Going back to the Sessions
    // tab doesn't change the surface, so this unmount is the only signal the host gets.
    return () => onWatch(undefined);
  }, [session.sessionId, session.tool]);

  const mine: boolean =
    detail?.sessionId === session.sessionId && detail?.tool === session.tool;

  return mine ? detail : undefined;
};
