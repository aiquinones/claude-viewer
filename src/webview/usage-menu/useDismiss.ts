import { useEffect } from 'react';

interface UseDismissArgs {
  root: { current: HTMLElement | null };
  open: boolean;
  onDismiss: () => void;
}

// Closes on escape or on a press outside. `pointerdown` rather than `click`, so a press that starts
// outside and releases inside doesn't leave the menu open behind the thing you meant to hit.
export const useDismiss = ({ root, open, onDismiss }: UseDismissArgs): void => {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent): void => {
      if (!root.current?.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onDismiss, root]);
};
