import { Check, ChevronLeft, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SessionUsage } from '../../model/usage/types';
import { AgentToolTag } from '../AgentToolTag';
import { displayFolder } from '../display-path';
import { PanelActions } from '../PanelActions';
import { sessionName } from '../usage-sessions/session-filter';
import { Tooltip } from '../Tooltip';

// How long the button holds its tick. The host also says so in the status bar; this is the half you
// are actually looking at.
const COPIED_MS: number = 1600;

interface SessionBreadcrumbProps {
  session: SessionUsage;
  // Back to the Sessions tab. State rather than navigation — the list keeps its filter and its
  // scroll, because it was never unmounted.
  onBack: () => void;
  onCopyId: (sessionId: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
}

// `Usage › <session name>`, and under it the id you would paste into `claude --resume` and the
// folder it ran in. The back arrow goes up one level rather than home: this is a page inside the
// usage surface, which is what the breadcrumb is saying.
export const SessionBreadcrumb = ({
  session,
  onBack,
  onCopyId,
  onSearch,
  onRefresh
}: SessionBreadcrumbProps) => (
  <header className="flex items-center gap-2 border-b border-border px-4 py-3">
    <Button variant="ghost" size="icon" title="Back to Usage" onClick={onBack}>
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
        <AgentToolTag tool={session.tool} />
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <SessionId sessionId={session.sessionId} onCopy={onCopyId} />
        {/* Where it ran. This came off the rows in the list, which spans every folder on the
            machine and repeated a path down the whole column — here there is one session, so the
            question is worth answering. The absolute path rather than a workspace-relative one:
            on this page, which worktree is the thing you came to check. */}
        <span
          title={session.cwd}
          className="mono min-w-0 truncate text-[11px] text-muted-foreground"
        >
          {displayFolder({ path: session.cwd, workspaceRoot: undefined })}
        </span>
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
