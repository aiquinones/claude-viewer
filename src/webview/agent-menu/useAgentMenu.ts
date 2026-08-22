import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Point } from './placement';

// Whether a row's command menu is up, and where it was opened. One hook per row: the menu belongs
// to the row it acts on, so two rows can't share the state and a row that scrolls away takes its
// menu with it.
export const useAgentMenu = () => {
  const [anchor, setAnchor] = useState<Point | undefined>(undefined);

  // The row's own click opens the agent, so a right-click has to stop before it gets there — and
  // `preventDefault` is what keeps VS Code's own webview menu out of the way.
  const open = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor({ x: event.clientX, y: event.clientY });
  };

  const close = useCallback((): void => setAnchor(undefined), []);

  useDismiss({ open: anchor !== undefined, onDismiss: close });

  return { anchor, open, close };
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
