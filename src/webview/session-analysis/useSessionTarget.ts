import { useEffect, useRef, useState } from 'react';
import { SessionUsage } from '../../model/usage/types';
import { SessionRequest } from './session-target';

// Where a request has got to. `idle` is both "nothing was asked for" and "the answer is on screen",
// which are the same thing to the caller: neither one draws anything of its own.
export type SessionTargetState = 'idle' | 'pending' | 'missing';

interface UseSessionTargetArgs {
  // Undefined until something outside the usage surface asks for a session.
  request: SessionRequest | undefined;
  // Every session on record, or undefined while the scan behind them is still out. Navigating here
  // is what starts that scan, so undefined is the normal first state rather than an edge case.
  sessions: SessionUsage[] | undefined;
  onResolve: (session: SessionUsage) => void;
}

// A session id into the session it names, once there's a list to look in. Three outcomes and all
// three are ordinary: the list hasn't landed, the session is in it, or it isn't — see
// `SessionNotFound` for the ways the last one happens honestly.
export const useSessionTarget = ({
  request,
  sessions,
  onResolve
}: UseSessionTargetArgs): SessionTargetState => {
  const [state, setState] = useState<SessionTargetState>('idle');
  // Which request has already been answered. The history re-posts on a 60s poll, and without this a
  // session that showed up in a later pass would yank the reader onto a page they gave up on a
  // minute ago — an answer arriving after the question stopped being asked.
  const settled = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!request) return setState('idle');
    if (settled.current === request.nonce) return;
    if (!sessions) return setState('pending');

    const found: SessionUsage | undefined = sessions.find(
      (session) => session.sessionId === request.sessionId && session.tool === request.tool
    );

    settled.current = request.nonce;
    if (!found) return setState('missing');

    setState('idle');
    onResolve(found);
  }, [request, sessions]);

  return state;
};
