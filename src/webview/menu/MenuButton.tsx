import { MoreHorizontal } from 'lucide-react';
import { ReactNode, useCallback, useRef, useState } from 'react';
import { Z } from '../z-layers';
import { useDismiss } from './useDismiss';

interface MenuButtonProps {
  // Named for what the menu holds, not for the `...`. Reaches both the screen-reader label on the
  // trigger and the menu's own `aria-label`.
  label: string;
  // Takes the close, so an item that picks something can shut the menu behind it.
  children: (close: () => void) => ReactNode;
  // Where the trigger sits in the row that holds it. Callers place the button and nothing else —
  // the menu positions itself against it.
  className?: string;
}

// The `...` and the box it opens. Two menus draw this now — the usage surface's settings and the
// panel's own — and duplicating the trigger would be two controls that drift apart by a border
// radius.
//
// Click to open, not hover: a hover menu you can click through closes under the pointer on the way
// to an item.
export const MenuButton = ({ label, children, className = '' }: MenuButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const root = useRef<HTMLSpanElement>(null);

  // Stable, so the listeners behind it are bound once per open rather than on every render.
  const close = useCallback((): void => setOpen(false), []);

  useDismiss({ root, open, onDismiss: close });

  return (
    <span ref={root} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">{label}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          // Down and to the left: the trigger sits at the right end of a header, so a menu opening
          // upward would leave the panel and one opening rightward would run off its edge.
          style={{ zIndex: Z.card }}
          className="absolute right-0 top-full mt-1.5 flex w-max max-w-[min(24rem,calc(100vw-3rem))] flex-col divide-y divide-border rounded-md border border-border bg-popover p-1.5 text-xs shadow-lg"
        >
          {children(close)}
        </div>
      )}
    </span>
  );
};
