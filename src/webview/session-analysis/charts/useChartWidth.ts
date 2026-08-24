import { RefObject, useLayoutEffect, useState } from 'react';

// How wide the chart's frame is. An svg needs a number: `width="100%"` with
// `preserveAspectRatio="none"` would stretch the strokes and turn every dot into an ellipse.
//
// Measured before paint rather than in a `useEffect`, so the chart's first frame is the right size
// instead of a zero-width one that snaps open.
export const useChartWidth = (frame: RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    const element: HTMLElement | null = frame.current;
    if (!element) return;

    setWidth(element.clientWidth);

    const observer: ResizeObserver = new ResizeObserver((entries) => {
      const entry: ResizeObserverEntry | undefined = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [frame]);

  return width;
};
