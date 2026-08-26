import { useEffect, useState } from 'react';

// When the page first had something to draw. `useEffect` runs after the commit, so this is the
// closest the webview gets to "the reader can see it" without a second frame's worth of machinery.
//
// Set once: the snapshot is posted again on every config change, and a launch happened only once.
export const useFirstPaint = (hasContent: boolean): number | undefined => {
  const [paintedAt, setPaintedAt] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!hasContent || paintedAt !== undefined) return;
    setPaintedAt(Date.now());
  }, [hasContent, paintedAt]);

  return paintedAt;
};
