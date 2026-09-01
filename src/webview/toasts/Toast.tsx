import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentToolIcon } from '../agent-icon/AgentToolIcon';
import { QueuedToast } from './toast-message';

interface ToastProps {
  toast: QueuedToast;
  onDismiss: () => void;
  // Where the card goes when it's clicked. Only called for a card that names a session.
  onOpen: (sessionId: string) => void;
}

// One card. Same shape as an agent row and for the same reason — a <button> can't hold the ✕, so
// the wrapper takes the click and the inner button carries no handler, which leaves keyboard Enter
// working through the bubble. No `role="status"` on it: the stack it sits in is the live region,
// and a second one nested inside announces the card twice.
export const Toast = ({ toast, onDismiss, onOpen }: ToastProps) => {
  const target: string | undefined = toast.sessionId;

  return (
    <div
      onClick={target ? () => onOpen(target) : undefined}
      className={cn(
        'relative flex items-start overflow-hidden rounded-md border border-border bg-popover pb-1 shadow-lg',
        target && 'cursor-pointer hover:bg-accent'
      )}
    >
      <button
        type="button"
        tabIndex={target ? 0 : -1}
        className="flex min-w-0 flex-1 items-start gap-2 px-3 py-2.5 pr-1 text-left"
      >
        <AgentToolIcon tool={toast.tool} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs font-medium">{toast.title}</span>
          <span className="truncate text-[11px] text-muted-foreground">{toast.detail}</span>
        </span>
      </button>

      <button
        type="button"
        aria-label="Dismiss"
        title="Dismiss"
        onClick={(event) => {
          // Or dismissing the card also opens the agent it was about.
          event.stopPropagation();
          onDismiss();
        }}
        className="m-1.5 flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <X className="size-3" />
      </button>

      {/* How long is left, as the bar fills. `left-0` and not `inset-x-0` — pinning both edges is
          what sets a width, and this one is the animation. */}
      <span
        className="toast-timer absolute bottom-0 left-0 h-0.5"
        style={{ animationDuration: `${toast.durationMs}ms` }}
      />
    </div>
  );
};
