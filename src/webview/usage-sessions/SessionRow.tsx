import { GitBranch } from 'lucide-react';
import { SessionUsage } from '../../model/usage/types';
import { AgentToolTag } from '../AgentToolTag';
import { displayFolder } from '../display-path';
import { formatAge } from '../format-age';
import { sessionName } from './session-filter';

interface SessionRowProps {
  session: SessionUsage;
  workspaceRoot: string | undefined;
  now: number;
  onOpen: (session: SessionUsage) => void;
}

// One session in the list. The whole row is the button — nothing inside it is separately pressable,
// which is what lets this one stay a plain `<button>` where the agent rows had to wrap a div.
//
// What it says is what identifies a session you're looking for: its name, and the branch it was on.
// Not what it cost — the list is how you find the session whose page carries that, and a row
// carrying an output-token figure invited the question of what the number was rather than answering
// it.
export const SessionRow = ({ session, workspaceRoot, now, onOpen }: SessionRowProps) => (
  <button
    type="button"
    onClick={() => onOpen(session)}
    className="flex w-full cursor-pointer flex-col gap-0.5 px-3 py-2 text-left hover:bg-accent"
  >
    <span className="block w-full truncate text-xs text-foreground">{sessionName(session)}</span>

    <span className="flex w-full min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
      {session.branch && (
        <span className="mono flex min-w-0 items-center gap-1">
          <GitBranch className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{session.branch}</span>
        </span>
      )}
      {/* Only where it says something the header hasn't — the same rule an agent row follows. A
          session in the open folder would print that folder's name back at you; a worktree is under
          the same root and still prints, since which worktree is the whole question. */}
      {session.cwd !== workspaceRoot && (
        <span className="mono min-w-0 truncate">
          {displayFolder({ path: session.cwd, workspaceRoot })}
        </span>
      )}
      {/* Which CLI and how long ago, as one group at the right edge — the two things that are on
          every row whatever else is. The `ml-auto` is on the wrapper rather than on the tag: the
          tag sets its own layout classes, and two of those competing is decided by the order
          Tailwind emitted them in. */}
      <span className="ml-auto flex shrink-0 items-center gap-2">
        <AgentToolTag tool={session.tool} />
        {/* Last activity, not duration. A session's age is how long since it did anything, which
            is what makes the list sorted by it read top-down as most recent first. */}
        <span>{formatAge(Math.max(now - session.lastAt, 0))} ago</span>
      </span>
    </span>
  </button>
);
