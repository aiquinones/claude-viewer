import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SkillGraph } from '../../model/types';
import { REST_ENERGY, stepForces } from './forces';
import { GraphLayout, GraphView, IDENTITY_VIEW, Size, toLayout } from './layout';
import { GraphElements, emptyElements, paintGraph } from './paint';
import { GraphPointer, useGraphPointer } from './useGraphPointer';

// How many steps a reduced-motion open runs before painting once. Enough for the spiral seed to
// resolve into clusters.
const SETTLE_STEPS: number = 600;

interface UseForceGraphArgs {
  graph: SkillGraph;
  // The node the card is open on. Painted every frame, so the card sticks to a moving node.
  openPath: string | undefined;
}

export interface ForceGraph extends GraphPointer {
  boxRef: RefObject<HTMLDivElement>;
  size: Size;
  layout: GraphLayout;
  setViewElement: (element: SVGGElement | null) => void;
  setDotsElement: (element: HTMLDivElement | null) => void;
  setCardElement: (element: HTMLDivElement | null) => void;
  setNodeElement: (path: string) => (element: SVGGElement | null) => void;
  setEdgeElement: (index: number) => (element: SVGLineElement | null) => void;
}

// The simulation's lifetime: seed, run, settle, stop. Nothing here re-renders React — positions are
// written straight to the elements, and the only state is the box's size.
export const useForceGraph = ({ graph, openPath }: UseForceGraphArgs): ForceGraph => {
  const layout: GraphLayout = useMemo(() => toLayout(graph), [graph]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const elements = useRef<GraphElements>(emptyElements());
  const view = useRef<GraphView>({ ...IDENTITY_VIEW });
  const frame = useRef<number | undefined>(undefined);
  const lastTime = useRef<number>(0);
  const openRef = useRef<string | undefined>(openPath);

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const sizeRef = useRef<Size>(size);
  sizeRef.current = size;
  openRef.current = openPath;

  const paint = useCallback((): void => {
    paintGraph({
      nodes: layout.nodes,
      links: layout.links,
      elements: elements.current,
      view: view.current,
      size: sizeRef.current,
      openPath: openRef.current
    });
  }, [layout]);

  // Restarts the loop after something disturbs the graph — a drag, a resize, a new graph.
  const heat = useCallback((): void => {
    if (frame.current !== undefined) return;
    if (prefersReducedMotion()) {
      paint();
      return;
    }

    lastTime.current = performance.now();
    frame.current = requestAnimationFrame(function tick(now: number): void {
      const energy: number = stepForces({
        nodes: layout.nodes,
        links: layout.links,
        dt: (now - lastTime.current) / 1000
      });
      lastTime.current = now;
      paint();

      // Nothing visible is moving, so stop drawing until something disturbs it again.
      if (energy < REST_ENERGY) {
        frame.current = undefined;
        return;
      }
      frame.current = requestAnimationFrame(tick);
    });
  }, [layout, paint]);

  // A new graph starts from its seed positions, and a reduced-motion open skips straight to the
  // answer rather than animating there.
  useEffect(() => {
    if (prefersReducedMotion()) {
      for (let step = 0; step < SETTLE_STEPS; step++) {
        stepForces({ nodes: layout.nodes, links: layout.links, dt: 1 / 60 });
      }
      paint();
      return;
    }
    heat();

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      frame.current = undefined;
    };
  }, [layout, heat, paint]);

  useEffect(() => {
    const box: HTMLDivElement | null = boxRef.current;
    if (!box) return;

    const observer: ResizeObserver = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // A resize moves the origin, so what was centered has to be redrawn there — and the svg only
  // exists once there's a size, so this is also the first paint that reaches an element.
  useEffect(() => {
    paint();
  }, [size, openPath, paint]);

  const pointer: GraphPointer = useGraphPointer({
    boxRef,
    view,
    nodes: layout.nodes,
    heat,
    paint
  });

  return {
    ...pointer,
    boxRef,
    size,
    layout,
    setViewElement: (element) => void (elements.current.view = element),
    setDotsElement: (element) => void (elements.current.dots = element),
    setCardElement: (element) => void (elements.current.card = element),
    setNodeElement: (path) => (element) => setInMap(elements.current.nodes, path, element),
    setEdgeElement: (index) => (element) => setInMap(elements.current.edges, index, element)
  };
};

const setInMap = <Key, Element>(map: Map<Key, Element>, key: Key, element: Element | null): void => {
  if (element) map.set(key, element);
  else map.delete(key);
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
