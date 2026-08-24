import { useEffect } from 'react';
import { AgentTool } from '../../model/types';
import { SessionDetail, SessionUsage } from '../../model/usage/types';

interface UseSessionDetailArgs {
  session: SessionUsage;
  // The last reply the host sent, whichever session it was about.
  detail: SessionDetail | undefined;
  onRequest: (args: { sessionId: string; tool: AgentTool }) => void;
}

// One session's turns and skill loads, asked for on mount and dropped when it isn't the answer to
// the question being asked. Same shape as `useFileBody`: the reply carries what it's about, so a
// read that lands after you've gone back to the list is ignored rather than rendered.
export const useSessionDetail = ({
  session,
  detail,
  onRequest
}: UseSessionDetailArgs): SessionDetail | undefined => {
  useEffect(() => {
    onRequest({ sessionId: session.sessionId, tool: session.tool });
  }, [session.sessionId, session.tool]);

  const mine: boolean =
    detail?.sessionId === session.sessionId && detail?.tool === session.tool;

  return mine ? detail : undefined;
};
