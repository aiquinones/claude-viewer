import { GitBranch } from 'lucide-react';
import { SessionUsage } from '../../model/usage/types';
import { AgentToolIcon } from '../agent-icon/AgentToolIcon';
import { formatAge } from '../format-age';
import { sessionName } from './session-filter';

interface SessionRowProps {
  session: SessionUsage;
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
//
// And not where it ran. The agent rows drop the directory when it matches the open folder, which
// works there because those agents are nearly all in it; here the list spans every folder on the
// machine, so the same rule leaves a path on most rows — one long enough to crowd the branch, and
// repeated down the column whether or not you were asking. The scope in the `...` is what decides
// which folders are in the list at all.
export const SessionRow = ({ session, now, onOpen }: SessionRowProps) => (
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
      {/* Which CLI and how long ago, as one group at the right edge — the two things that are on
          every row whatever else is. The `ml-auto` is on the wrapper rather than on the tag: the
          tag sets its own layout classes, and two of those competing is decided by the order
          Tailwind emitted them in. */}
      <span className="ml-auto flex shrink-0 items-center gap-2">
        <AgentToolIcon tool={session.tool} />
        {/* Last activity, not duration. A session's age is how long since it did anything, which
            is what makes the list sorted by it read top-down as most recent first. */}
        <span>{formatAge(Math.max(now - session.lastAt, 0))} ago</span>
      </span>
    </span>
  </button>
);
