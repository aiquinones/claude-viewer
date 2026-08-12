import {
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useEffect
} from 'react';
import { GraphNodeState, GraphView, IDENTITY_VIEW, MAX_ZOOM, MIN_ZOOM, toSim } from './layout';

// One notch of the wheel.
const ZOOM_RATE: number = 0.0015;

// Under this much movement, a press on a node was a click at it rather than a drag of it.
const TAP_SLOP: number = 4;

export interface DragNodeArgs {
  event: ReactPointerEvent;
  path: string;
  // Called on release when the pointer never left the node.
  onTap: () => void;
}

interface UseGraphPointerArgs {
  boxRef: RefObject<HTMLDivElement>;
  // The pan/zoom transform, written here and read by the frame loop.
  view: MutableRefObject<GraphView>;
  nodes: GraphNodeState[];
  // Restarts the simulation after something moves.
  heat: () => void;
  paint: () => void;
}

export interface GraphPointer {
  // Starts a drag on one node. Everything tied to it follows, which is the whole point.
  dragNode: (args: DragNodeArgs) => void;
  panBackground: (event: ReactPointerEvent) => void;
  resetView: () => void;
}

// Everything the pointer does to the graph: drag a node, pan the background, zoom. Separate from
// the loop that draws it — these only ever set a position and ask for a repaint.
export const useGraphPointer = ({
  boxRef,
  view,
  nodes,
  heat,
  paint
}: UseGraphPointerArgs): GraphPointer => {
  // Zoom is Cmd/Ctrl + wheel: the pane this sits in scrolls, and a bare wheel belongs to it.
  // Passive listeners can't preventDefault, which is why this isn't an onWheel prop.
  useEffect(() => {
    const box: HTMLDivElement | null = boxRef.current;
    if (!box) return;

    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      const bounds: DOMRect = box.getBoundingClientRect();
      const before = toSim({
        client: { x: event.clientX, y: event.clientY },
        bounds,
        view: view.current
      });
      const zoom: number = clampZoom(view.current.zoom * Math.exp(-event.deltaY * ZOOM_RATE));

      // Keep whatever is under the cursor under the cursor.
      view.current = {
        zoom,
        panX: event.clientX - bounds.left - bounds.width / 2 - before.x * zoom,
        panY: event.clientY - bounds.top - bounds.height / 2 - before.y * zoom
      };
      paint();
    };

    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [boxRef, view, paint]);

  // A press that never really moved is a tap, and a tap opens the card — which is why the click
  // isn't a separate handler. Dragging a node would otherwise pop its card open on release.
  const dragNode = useCallback(
    ({ event, path, onTap }: DragNodeArgs): void => {
      // Ahead of the guard below: whatever happens, a press on a node isn't a press on the
      // background, which would pan the view and close the card.
      event.preventDefault();
      event.stopPropagation();

      const box: HTMLDivElement | null = boxRef.current;
      const node: GraphNodeState | undefined = nodes.find((candidate) => candidate.path === path);
      if (!box || !node) return;

      node.pinned = true;
      const from = { x: event.clientX, y: event.clientY };
      let dragged: boolean = false;

      trackPointer({
        event,
        onMove: (moved) => {
          if (Math.hypot(moved.clientX - from.x, moved.clientY - from.y) > TAP_SLOP) dragged = true;

          const point = toSim({
            client: { x: moved.clientX, y: moved.clientY },
            bounds: box.getBoundingClientRect(),
            view: view.current
          });
          node.x = point.x;
          node.y = point.y;
          // Under reduced motion `heat` paints instead of starting a loop, so the node still
          // follows the cursor — it's the graph around it that doesn't animate.
          heat();
        },
        onEnd: () => {
          node.pinned = false;
          heat();
          if (!dragged) onTap();
        }
      });
    },
    [boxRef, view, nodes, heat]
  );

  const panBackground = useCallback(
    (event: ReactPointerEvent): void => {
      const start: GraphView = { ...view.current };
      const from = { x: event.clientX, y: event.clientY };

      trackPointer({
        event,
        onMove: (moved) => {
          view.current = {
            ...view.current,
            panX: start.panX + (moved.clientX - from.x),
            panY: start.panY + (moved.clientY - from.y)
          };
          paint();
        }
      });
    },
    [view, paint]
  );

  const resetView = useCallback((): void => {
    view.current = { ...IDENTITY_VIEW };
    paint();
  }, [view, paint]);

  return { dragNode, panBackground, resetView };
};

const clampZoom = (zoom: number): number => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);

interface TrackPointerArgs {
  event: ReactPointerEvent;
  onMove: (event: PointerEvent) => void;
  onEnd?: () => void;
}

// Listeners live on the window, not the element: a fast drag leaves the node behind and the moves
// would stop arriving. Pointer capture would do it too, but not for a drag that starts on the svg
// and ends over the card.
const trackPointer = ({ event, onMove, onEnd }: TrackPointerArgs): void => {
  const pointerId: number = event.pointerId;

  const move = (moved: PointerEvent): void => {
    if (moved.pointerId === pointerId) onMove(moved);
  };
  const end = (ended: PointerEvent): void => {
    if (ended.pointerId !== pointerId) return;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
    onEnd?.();
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
};
