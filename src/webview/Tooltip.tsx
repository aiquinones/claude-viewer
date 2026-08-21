import { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  // A keyboard shortcut, printed after the label in a key cap.
  hint?: string;
  // No bubble, for as long as whatever this labels is explaining itself another way — the color
  // picker's popover opens exactly where the bubble sits.
  disabled?: boolean;
  children: ReactNode;
}

// A hover label that can carry a shortcut. The native `title` attribute can't — it's OS-styled and
// a second late — and a real popover library would be a dependency for one bubble.
//
// The group is named, because a tooltip inside another `group` is a normal place for one to live —
// an icon button in an agent row — and `group-hover:` matches *any* ancestor group. Unnamed, the
// bubble opens on the row's hover rather than on the button's.
//
// `group-has-focus-visible/tip` is what makes it reachable by keyboard, since the thing it wraps
// is a button. Focus-visible rather than focus-within: a click focuses that button too, and a
// focus-within bubble stays up after the pointer has gone until you focus something else.
export const Tooltip = ({ label, hint, disabled = false, children }: TooltipProps) => (
  <span className="group/tip relative inline-flex">
    {children}
    {!disabled && (
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-20 mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover/tip:opacity-100 group-has-focus-visible/tip:opacity-100"
      >
        {label}
        {hint && (
          <kbd className="mono rounded border border-border bg-accent px-1 text-[0.6875rem] text-muted-foreground">
            {hint}
          </kbd>
        )}
      </span>
    )}
  </span>
);
