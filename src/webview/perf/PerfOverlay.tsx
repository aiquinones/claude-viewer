import { Check, Copy, X, Zap } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { PerfClientMarks, withClientMarks } from '../../model/perf/client-marks';
import { PerfReport } from '../../model/perf/types';
import { Z } from '../z-layers';
import { formatMs } from './format-ms';
import { PerfPhases } from './PerfPhases';
import { PerfReads } from './PerfReads';
import { perfReportText } from './perf-text';

interface PerfOverlayProps {
  report: PerfReport;
  // The webview's own two marks. The host can't measure either of them and this is the one place
  // both halves of the timeline are in hand.
  marks: PerfClientMarks;
  workspaceRoot: string | undefined;
  onDismiss: () => void;
}

// What the launch cost, floating over the landing page. `fixed` rather than absolute: the page
// under it scrolls, and nothing about this should move or take up room when it does.
export const PerfOverlay = ({ report, marks, workspaceRoot, onDismiss }: PerfOverlayProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const full: PerfReport = withClientMarks({ report, marks });

  return (
    <div
      style={{ zIndex: Z.floating }}
      className="fixed bottom-4 right-4 flex w-[min(24rem,calc(100vw-2rem))] flex-col items-end gap-2"
    >
      {isOpen && <Card report={full} workspaceRoot={workspaceRoot} />}

      <div className="flex items-center gap-1 rounded-full border border-border bg-popover py-1 pl-2.5 pr-1 shadow-lg">
        <PillButton
          label={isOpen ? 'Hide performance details' : 'Show performance details'}
          expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Zap className="size-3.5 text-primary" />
        </PillButton>

        <PillButton label="Dismiss" onClick={onDismiss}>
          <X className="size-3.5" />
        </PillButton>
      </div>
    </div>
  );
};

interface CardProps {
  report: PerfReport;
  workspaceRoot: string | undefined;
}

// Capped and scrollable: the slowest list is eight rows and the panel can be docked short.
const Card = ({ report, workspaceRoot }: CardProps) => (
  <div className="flex max-h-[60vh] w-full flex-col gap-3 overflow-y-auto overflow-x-clip rounded-md border border-border bg-popover p-3 shadow-lg">
    <div className="flex items-baseline justify-between gap-2">
      <h2 className="text-xs font-medium">
        Ready in{' '}
        <span className="mono tabular-nums">
          {report.readyMs === undefined ? '—' : formatMs(report.readyMs)}
        </span>
      </h2>
      <CopyButton report={report} />
    </div>

    <PerfPhases phases={report.phases} running={report.running} />
    <PerfReads report={report} workspaceRoot={workspaceRoot} />
  </div>
);

interface CopyButtonProps {
  report: PerfReport;
}

// Stays on the webview side rather than going through the host's clipboard message: that one takes
// a session id and resolves it against the host's own cache, on purpose — it isn't a channel for
// arbitrary text.
const CopyButton = ({ report }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = (): void => {
    void navigator.clipboard.writeText(perfReportText(report));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy the report"
      className="flex shrink-0 items-center gap-1 rounded-sm px-1 py-0.5 text-[11px] text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
    >
      {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {isCopied ? 'Copied' : 'Copy'}
    </button>
  );
};

interface PillButtonProps {
  label: string;
  expanded?: boolean;
  onClick: () => void;
  children: ReactNode;
}

const PillButton = ({ label, expanded, onClick, children }: PillButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    aria-expanded={expanded}
    className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
  >
    {children}
  </button>
);
