import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

// One notch of the wheel, matching the graph's feel.
const ZOOM_RATE: number = 0.0015;
const MIN_ZOOM: number = 0.6;
const MAX_ZOOM: number = 1.8;

interface UseCanvasZoomArgs {
  // The element the wheel is read from. Shared with useCursorGlow, which owns the ref.
  boxRef: RefObject<HTMLElement>;
}

export interface CanvasZoom {
  // Written to the surface as the CSS `zoom` property, not `scale`. Zoom reflows, so a zoomed-in
  // flow is taller and the pane scrolls to reach the rest of it — with dragging gone, scrolling is
  // the only way to move, and `scale` leaves the layout box its original size.
  zoom: number;
  reset: () => void;
}

// ⌘/ctrl + wheel over the canvas. There is no pan: dragging a flow that can only ever be a column
// bought nothing that scrolling doesn't already do.
export const useCanvasZoom = ({ boxRef }: UseCanvasZoomArgs): CanvasZoom => {
  const [zoom, setZoom] = useState<number>(1);
  const zoomRef = useRef<number>(zoom);
  zoomRef.current = zoom;

  // A bare wheel belongs to the pane this sits in, so only the modified one is taken. Passive
  // listeners can't preventDefault, which is why this isn't an onWheel prop.
  useEffect(() => {
    const box: HTMLElement | null = boxRef.current;
    if (!box) return;

    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom(clamp(zoomRef.current * Math.exp(-event.deltaY * ZOOM_RATE)));
    };

    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [boxRef]);

  const reset = useCallback((): void => setZoom(1), []);

  return { zoom, reset };
};

const clamp = (zoom: number): number => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
