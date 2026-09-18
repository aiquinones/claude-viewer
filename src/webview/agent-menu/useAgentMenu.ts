import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Point, anchorFor } from './placement';

// Whether a row's command menu is up, and where it was opened. One hook per row: the menu belongs
// to the row it acts on, so two rows can't share the state and a row that scrolls away takes its
// menu with it.
//
// Both buttons open it. A left click used to open the agent — that's the menu's first item now, so
// the commands are findable without having to know the row answers a right-click.
export const useAgentMenu = () => {
  const [anchor, setAnchor] = useState<Point | undefined>(undefined);
  // Whether the press underneath the click being handled is the one that closed the menu. See `arm`.
  const dismissedByPress = useRef<boolean>(false);

  const close = useCallback((): void => setAnchor(undefined), []);

  // The row's `pointerdown`, which runs before the dismiss listener below has closed anything. A
  // press anywhere dismisses, and a press on the row is also the start of a click — so without this
  // the click that closed the menu would reopen it on the way past, and a left click could only
  // ever open.
  const arm = (): void => {
    dismissedByPress.current = anchor !== undefined;
  };

  // The right-click path: opens wherever the pointer is, whether or not it was already up.
  // `preventDefault` is what keeps VS Code's own webview menu out of the way, and the row's click
  // opens the menu too, so the event stops here.
  const open = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor(
      anchorFor({
        detail: event.detail,
        pointer: { x: event.clientX, y: event.clientY },
        row: event.currentTarget.getBoundingClientRect()
      })
    );
  };

  // The left-click path: the same menu, except that the click which dismissed it leaves it shut.
  const toggle = (event: MouseEvent): void => {
    if (dismissedByPress.current) return;
    open(event);
  };

  useDismiss({ open: anchor !== undefined, onDismiss: close });

  return { anchor, arm, open, toggle, close };
};

interface UseDismissArgs {
  open: boolean;
  onDismiss: () => void;
}

// Escape, a press anywhere else, or a scroll. The scroll is the one a normal popover doesn't need:
// this is placed in viewport coordinates, so the list moving under it leaves it pointing at a row
// it was never about. Capture phase, because the pane that scrolls is not the window.
//
// The press listener is on `pointerdown` rather than `click` — a press that starts outside and
// releases on an item would otherwise fire that item on the way past. It fires for any press at
// all; the menu keeps itself open by stopping its own, which is one line there against a ref
// threaded through here.
const useDismiss = ({ open, onDismiss }: UseDismissArgs): void => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onDismiss);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('scroll', onDismiss, true);

    return () => {
      document.removeEventListener('pointerdown', onDismiss);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('scroll', onDismiss, true);
    };
  }, [open, onDismiss]);
};
