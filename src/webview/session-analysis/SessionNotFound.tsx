import { Button } from '@/components/ui/button';
import { AGENT_TOOL_LABEL } from '../../model/types';
import { SessionTarget } from './session-target';

interface SessionNotFoundProps {
  target: SessionTarget;
  // Whether the scope setting is narrowing the list this was looked up in. Named rather than read
  // here: the reasons below are about the corpus, and which sessions are in it is the caller's.
  scoped: boolean;
  onDismiss: () => void;
}

// A session asked for by id that isn't in the history. Every way this happens is ordinary, which is
// why it's a note rather than an error — and why it lists them: the reader pressed a command on a
// row that plainly exists, so "not found" on its own reads as a bug in the panel.
//
// A running agent is the one asker today, and a running agent is exactly the case most likely to
// land here: the history is folded out of finished turns, so a session gets in once it has paid for
// something.
export const SessionNotFound = ({ target, scoped, onDismiss }: SessionNotFoundProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
    <p className="text-sm font-medium">This session isn&apos;t on record yet</p>
    <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
      {AGENT_TOOL_LABEL[target.tool]} session{' '}
      <span className="mono">{target.sessionId.slice(0, 8)}</span> is running, but nothing has been
      folded for it here.{' '}
      {scoped
        ? 'The scope is set to this workspace, so a session working anywhere else is left out — and a session that has not finished a turn has nothing to count yet.'
        : 'A session that has not finished a turn has nothing to count yet, and one resumed a moment ago can still name a transcript the scan has not reached.'}
    </p>
    <Button variant="secondary" size="sm" onClick={onDismiss}>
      Back to sessions
    </Button>
  </div>
);
