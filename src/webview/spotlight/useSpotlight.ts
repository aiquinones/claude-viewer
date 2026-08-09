import { useEffect, useState } from 'react';
import { isOpenChord } from './chord';

// Whether the spotlight is up, and the one listener that opens it. `openedAt` is the mount key:
// hitting the chord while it's already open has to give you an empty box back, and that only
// happens if the component remounts.
export const useSpotlight = () => {
  const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!isOpenChord(event)) return;
      event.preventDefault();
      setOpenedAt(Date.now());
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    openedAt,
    // What the magnifier in the header calls. Same remount rule as the chord.
    open: (): void => setOpenedAt(Date.now()),
    dismiss: (): void => setOpenedAt(undefined)
  };
};
