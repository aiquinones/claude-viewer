import { Check, ChevronLeft, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AgentSession } from '../../model/types';
import { SessionUsage } from '../../model/usage/types';
import { AgentToolIcon } from '../agent-icon/AgentToolIcon';
import { displayFolder } from '../display-path';
import { PanelActions } from '../PanelActions';
import { SessionOrigin } from './session-target';
import { sessionName } from '../usage-sessions/session-filter';
import { Tooltip } from '../Tooltip';
import { SessionActivity } from './SessionActivity';

// How long the button holds its tick. The host also says so in the status bar; this is the half you
// are actually looking at.
const COPIED_MS: number = 1600;

interface SessionBreadcrumbProps {
  session: SessionUsage;
  // Only another folder helps identify the session — the open folder is already named by VS Code.
  workspaceRoot: string | undefined;
  // The live agent writing to this session, if one still is. Absent on a session that's over, which
  // is most of the list — nothing is drawn for those, since "not running" is what a page with no
  // badge already says.
  agent?: AgentSession;
  // Up one level, to the Sessions tab. State rather than navigation — the list keeps its filter and
  // its scroll, because it was never unmounted.
  onBack: () => void;
  // Where the reader came from, when that isn't the tabs. Absent for a session opened from the list,
  // where "up" and "back" are the same place and the arrow does what it always did.
  origin?: SessionOrigin;
  // Where the activity badge goes. Not the same trip as the arrow: that one retraces how you got
  // here, this one is the list of every agent running, whether or not you came from it.
  onOpenAgents: () => void;
  onCopyId: (sessionId: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
}

// `Usage › <session name>`, and under it the id you would paste into `claude --resume` and the
// folder it ran in. The crumb goes up one level rather than home: this is a page inside the usage
// surface, which is what the breadcrumb is saying.
//
// The arrow goes up too, until the page was opened from somewhere else — then it retraces that
// instead, and its label says which. It's the one control on the page that can, since the crumb has
// to keep naming where the page actually lives.
export const SessionBreadcrumb = ({
  session,
  workspaceRoot,
  agent,
  onBack,
  origin,
  onOpenAgents,
  onCopyId,
  onSearch,
  onRefresh
}: SessionBreadcrumbProps) => (
  <header className="flex items-center gap-2 border-b border-border px-4 py-3">
    <Button
      variant="ghost"
      size="icon"
      title={origin ? `Back to ${origin.label}` : 'Back to Usage'}
      onClick={origin ? origin.onReturn : onBack}
    >
      <ChevronLeft />
    </Button>

    <div className="mr-auto flex min-w-0 flex-col gap-0.5">
      <span className="flex min-w-0 items-center gap-1.5 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 cursor-pointer font-normal text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          Usage
        </button>
        <span className="shrink-0 text-muted-foreground" aria-hidden>
          ›
        </span>
        <span className="truncate font-semibold">{sessionName(session)}</span>
        <AgentToolIcon tool={session.tool} size="md" />
        {/* Why the numbers below move on their own. The same badge the Active Agents rows draw, on
            the same clock — a page that reads itself should say so where its name is. */}
        {agent && <SessionActivity agent={agent} onOpenAgents={onOpenAgents} />}
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <SessionId sessionId={session.sessionId} onCopy={onCopyId} />
        {/* The open folder is already named by VS Code. A different cwd, including a worktree,
            is the missing context this header needs to add. */}
        {session.cwd !== workspaceRoot && (
          <span
            title={session.cwd}
            className="mono min-w-0 truncate text-[11px] text-muted-foreground"
          >
            {displayFolder({ path: session.cwd, workspaceRoot })}
          </span>
        )}
      </span>
    </div>

    <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
  </header>
);

interface SessionIdProps {
  sessionId: string;
  onCopy: (sessionId: string) => void;
}

// The id in mono with a copy button. The host owns the clipboard — the panel names a session and
// hears nothing back — so the tick here is local, and it says the button was pressed rather than
// that the write succeeded.
const SessionId = ({ sessionId, onCopy }: SessionIdProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = (): void => {
    onCopy(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="mono truncate text-[11px] text-muted-foreground">{sessionId}</span>
      <Tooltip label={copied ? 'Copied' : 'Copy session id'}>
        <button
          type="button"
          onClick={copy}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className="sr-only">copy session id</span>
        </button>
      </Tooltip>
    </span>
  );
};
