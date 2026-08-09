import { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  // A keyboard shortcut, printed after the label in a key cap.
  hint?: string;
  children: ReactNode;
}

// A hover label that can carry a shortcut. The native `title` attribute can't — it's OS-styled and
// a second late — and a real popover library would be a dependency for one bubble.
//
// `group-focus-within` is what makes it reachable by keyboard, since the thing it wraps is a button.
export const Tooltip = ({ label, hint, children }: TooltipProps) => (
  <span className="group relative inline-flex">
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute right-0 top-full z-20 mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {label}
      {hint && (
        <kbd className="mono rounded border border-border bg-accent px-1 text-[0.6875rem] text-muted-foreground">
          {hint}
        </kbd>
      )}
    </span>
  </span>
);
