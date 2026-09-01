import { AgentTool } from '../../model/types';

// How long a card stays up before the bar finishes and it leaves on its own. Long enough to read
// two lines and reach the ✕, short enough that a burst clears itself.
export const TOAST_DURATION_MS: number = 6_000;

// How long the collapse takes. Matches the transition in `styles.css` — an entry is only dropped
// once the row it sits in has finished shrinking.
export const TOAST_EXIT_MS: number = 200;

// A ceiling on the pile rather than on what's visible: the stack scrolls, so this is only here so
// a panel that comes back to forty finished sessions can't grow the list without bound.
export const MAX_TOASTS: number = 24;

// What a producer decides. The queue supplies everything else.
export interface ToastMessage {
  // The first line — a session's name, usually.
  title: string;
  // The line under it.
  detail: string;
  tool: AgentTool;
  // Where the card goes when it's clicked. Absent means the card is text and nothing else.
  sessionId?: string;
}

// The same message once the queue has taken it.
export interface QueuedToast extends ToastMessage {
  id: string;
  // Per card rather than read from the constant above, so a later producer can ask for longer
  // without the stack learning about it.
  durationMs: number;
  // Told to go. It stays in the list for one collapse, which is what slides the cards above it
  // down into the space instead of dropping them.
  leaving: boolean;
}
