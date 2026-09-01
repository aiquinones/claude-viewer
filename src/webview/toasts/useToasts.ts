import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_TOASTS,
  QueuedToast,
  TOAST_DURATION_MS,
  TOAST_EXIT_MS,
  ToastMessage
} from './toast-message';

// One leg of a countdown: the timer running now, and when it started. What's left is worked out
// from those two when the leg is cut short.
interface Countdown {
  timer: number;
  startedAt: number;
}

export interface ToastQueue {
  // Newest first — the stack is pinned to the bottom of the panel and grows upward, so the head of
  // this array is the card on top.
  toasts: QueuedToast[];
  push: (message: ToastMessage) => void;
  dismiss: (id: string) => void;
  // Whether the pointer is over the stack. Both the countdown and the bar stop while it is.
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

// The panel's notification queue. Anything can push a card; the queue owns the ids, the countdown
// and the two-phase exit.
export const useToasts = (): ToastQueue => {
  const [toasts, setToasts] = useState<QueuedToast[]>([]);
  const [paused, setPaused] = useState<boolean>(false);
  // The timers running right now, and how much each card has left. Two maps rather than one: the
  // timers are cleared and rebuilt on every list change, the remainders survive that.
  const countdowns = useRef<Map<string, Countdown>>(new Map());
  const remaining = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string): void => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast))
    );
    // Gone for real one collapse later. Dropping it here instead would take the space with it and
    // the cards above would jump rather than slide.
    window.setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      TOAST_EXIT_MS
    );
  }, []);

  const push = useCallback((message: ToastMessage): void => {
    const id: string = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast: QueuedToast = { ...message, id, durationMs: TOAST_DURATION_MS, leaving: false };
    setToasts((current) => [toast, ...current].slice(0, MAX_TOASTS));
  }, []);

  // The countdowns follow the list rather than being started at the push, so a card that fell off
  // the cap or is already leaving has nothing counting for it. Every list change cuts each leg
  // short and starts a new one from what was left, which is also exactly what a pause and a resume
  // are — hence `paused` in the same effect rather than a second one racing it.
  useEffect(() => {
    if (!paused) {
      for (const toast of toasts) {
        if (toast.leaving) continue;
        const left: number = remaining.current.get(toast.id) ?? toast.durationMs;
        remaining.current.set(toast.id, left);
        countdowns.current.set(toast.id, {
          timer: window.setTimeout(() => dismiss(toast.id), left),
          startedAt: Date.now()
        });
      }
    }

    // Forget a card that has left, so an id is never carrying a remainder from a previous life.
    for (const id of [...remaining.current.keys()]) {
      if (!toasts.some((toast) => toast.id === id)) remaining.current.delete(id);
    }

    return () => {
      const now: number = Date.now();
      for (const [id, countdown] of countdowns.current) {
        window.clearTimeout(countdown.timer);
        const left: number = (remaining.current.get(id) ?? 0) - (now - countdown.startedAt);
        remaining.current.set(id, Math.max(left, 0));
      }
      countdowns.current.clear();
    };
  }, [toasts, paused, dismiss]);

  return { toasts, push, dismiss, paused, setPaused };
};
