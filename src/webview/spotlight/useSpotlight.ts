import { useEffect, useState } from 'react';

// Cmd+F is the find key everywhere; Cmd+K is the one web apps use for exactly this box. Both,
// because a webview only gets the keys the workbench didn't claim first.
const isOpenChord = (event: KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && !event.altKey && (event.key === 'f' || event.key === 'k');

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

  return { openedAt, dismiss: (): void => setOpenedAt(undefined) };
};
