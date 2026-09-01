import { cn } from '@/lib/utils';
import { Z } from '../z-layers';
import { Toast } from './Toast';
import { ToastQueue } from './useToasts';

interface ToasterProps {
  queue: ToastQueue;
  onOpenAgent: (sessionId: string) => void;
}

// The stack, bottom-right, with no container of its own — what you see is the cards. Pinned to the
// panel rather than to a pane, so it stays put while the slider moves under it.
//
// Newest first, and the box is sized by its content against a fixed bottom edge, so a new card
// grows the stack upward and the ones below it stay where they were. Past that height it scrolls,
// with the newest at the top of the scrollport — that's the one that has to be readable.
//
// Always mounted, even with nothing to show: a live region announces what arrives *into* it, and
// one that appears at the same moment as its first card announces nothing. Which is why the outer
// box takes no pointer events and the column inside it does — an empty stack is a zero-height
// column, so nothing invisible is sitting over the panel catching clicks.
export const Toaster = ({ queue, onOpenAgent }: ToasterProps) => (
  <div
    aria-live="polite"
    style={{ zIndex: Z.toast }}
    className={cn(
      'toast-stack pointer-events-none fixed bottom-4 right-4 flex max-h-[min(24rem,calc(100vh-2rem))] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-y-auto overflow-x-clip',
      queue.paused && 'toast-stack--paused'
    )}
  >
    <div
      onPointerEnter={() => queue.setPaused(true)}
      onPointerLeave={() => queue.setPaused(false)}
      className="pointer-events-auto flex flex-col"
    >
      {queue.toasts.map((toast) => (
        // The spacing is inside the collapsing row rather than a gap on the column, or a card on
        // its way out would leave its share of it behind for the length of the collapse.
        <div key={toast.id} className={cn('toast-slot', toast.leaving && 'toast-slot--leaving')}>
          <div className="min-h-0 overflow-hidden pt-2">
            <div className="toast-enter">
              <Toast toast={toast} onDismiss={() => queue.dismiss(toast.id)} onOpen={onOpenAgent} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
