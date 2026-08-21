import { SessionUsage } from '../../model/usage/types';
import { AgentToolTag } from '../AgentToolTag';
import { displayFolder } from '../display-path';
import { formatAge } from '../format-age';
import { plural } from '../format-size';
import { formatUsageTokens } from '../usage-format';
import { sessionName } from './session-filter';

interface SessionRowProps {
  session: SessionUsage;
  workspaceRoot: string | undefined;
  now: number;
  onOpen: (session: SessionUsage) => void;
}

// One session in the list. The whole row is the button — nothing inside it is separately pressable,
// which is what lets this one stay a plain `<button>` where the agent rows had to wrap a div.
export const SessionRow = ({ session, workspaceRoot, now, onOpen }: SessionRowProps) => (
  <button
    type="button"
    onClick={() => onOpen(session)}
    className="flex w-full cursor-pointer flex-col gap-0.5 px-3 py-2 text-left hover:bg-accent"
  >
    <span className="flex w-full min-w-0 items-center gap-2">
      <span className="min-w-0 flex-1 truncate text-xs text-foreground">
        {sessionName(session)}
      </span>
      <AgentToolTag tool={session.tool} />
      <span className="mono shrink-0 text-[11px] text-muted-foreground">
        {formatUsageTokens(session.outputTokens)}
      </span>
    </span>
    <span className="flex w-full min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
      <span className="min-w-0 flex-1 truncate">
        {displayFolder({ path: session.cwd, workspaceRoot })}
      </span>
      <span className="shrink-0">{plural(session.turns, 'turn')}</span>
      {/* Last activity, not duration. A session's age is how long since it did anything, which is
          what makes the list sorted by it read top-down as most recent first. */}
      <span className="shrink-0">{formatAge(Math.max(now - session.lastAt, 0))} ago</span>
    </span>
  </button>
);
