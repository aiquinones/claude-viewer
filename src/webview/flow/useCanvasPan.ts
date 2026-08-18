import { PointerEvent as ReactPointerEvent, RefObject, useCallback, useEffect, useRef } from 'react';

// One notch of the wheel, matching the graph's feel.
const ZOOM_RATE: number = 0.0015;
const MIN_ZOOM: number = 0.5;
const MAX_ZOOM: number = 2;

// The dot grid's spacing at 1×, so the background can be scaled with the content.
const DOT_SPACING: number = 16;

interface CanvasView {
  panX: number;
  panY: number;
  zoom: number;
}

const IDENTITY: CanvasView = { panX: 0, panY: 0, zoom: 1 };

export interface CanvasPan {
  boxRef: RefObject<HTMLDivElement>;
  setSurfaceElement: (element: HTMLDivElement | null) => void;
  setDotsElement: (element: HTMLDivElement | null) => void;
  panBackground: (event: ReactPointerEvent) => void;
  reset: () => void;
}

// Pan and zoom for an HTML surface. Not `useGraphPointer` — that one drags simulation nodes and
// speaks in the graph's centered coordinates, and a flow has neither. What carries over is the
// discipline: these handlers write `translate` and `scale` straight to the element, so nothing in
// styles.css may put a transition on either property.
//
// The origin is the top-centre of the box, which is where the column of cards hangs from.
export const useCanvasPan = (): CanvasPan => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const surface = useRef<HTMLDivElement | null>(null);
  const dots = useRef<HTMLDivElement | null>(null);
  const view = useRef<CanvasView>({ ...IDENTITY });

  const paint = useCallback((): void => {
    const { panX, panY, zoom } = view.current;

    if (surface.current) {
      surface.current.style.translate = `${panX}px ${panY}px`;
      surface.current.style.scale = String(zoom);
    }
    if (dots.current) {
      const spacing: number = DOT_SPACING * zoom;
      dots.current.style.backgroundSize = `${spacing}px ${spacing}px`;
      dots.current.style.backgroundPosition = `${panX}px ${panY}px`;
    }
  }, []);

  // Zoom is Cmd/Ctrl + wheel: the pane this sits in scrolls, and a bare wheel belongs to it.
  // Passive listeners can't preventDefault, which is why this isn't an onWheel prop.
  useEffect(() => {
    const box: HTMLDivElement | null = boxRef.current;
    if (!box) return;

    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const bounds: DOMRect = box.getBoundingClientRect();
      const originX: number = bounds.width / 2;
      const screenX: number = event.clientX - bounds.left;
      const screenY: number = event.clientY - bounds.top;

      // Where the cursor is on the untransformed surface, so it can be put back there after.
      const localX: number = (screenX - originX - view.current.panX) / view.current.zoom + originX;
      const localY: number = (screenY - view.current.panY) / view.current.zoom;
      const zoom: number = clamp(view.current.zoom * Math.exp(-event.deltaY * ZOOM_RATE));

      view.current = {
        zoom,
        panX: screenX - originX - zoom * (localX - originX),
        panY: screenY - zoom * localY
      };
      paint();
    };

    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [paint]);

  const panBackground = useCallback(
    (event: ReactPointerEvent): void => {
      const start: CanvasView = { ...view.current };
      const from = { x: event.clientX, y: event.clientY };
      const pointerId: number = event.pointerId;

      // Listeners on the window, not the element: a fast drag leaves the box behind and the moves
      // would stop arriving.
      const move = (moved: PointerEvent): void => {
        if (moved.pointerId !== pointerId) return;
        view.current = {
          ...view.current,
          panX: start.panX + (moved.clientX - from.x),
          panY: start.panY + (moved.clientY - from.y)
        };
        paint();
      };
      const end = (ended: PointerEvent): void => {
        if (ended.pointerId !== pointerId) return;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    },
    [paint]
  );

  const reset = useCallback((): void => {
    view.current = { ...IDENTITY };
    paint();
  }, [paint]);

  return {
    boxRef,
    setSurfaceElement: (element) => {
      surface.current = element;
      paint();
    },
    setDotsElement: (element) => {
      dots.current = element;
      paint();
    },
    panBackground,
    reset
  };
};

const clamp = (zoom: number): number => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
