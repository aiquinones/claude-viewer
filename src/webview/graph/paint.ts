// Everything the frame loop writes to the DOM, in one place. React never re-renders for a moved
// node — the elements are written through refs, the same rule `useCursorGlow` follows.

import { GraphLink, GraphNodeState, GraphView, Size, toLocal } from './layout';

// The dot grid's spacing at zoom 1, in pixels. `styles.css` draws one dot per cell.
export const DOT_SPACING: number = 22;

// Where an edge stops: clear of the source circle, and far enough short of the target one to leave
// the arrowhead somewhere to sit.
const SOURCE_GAP: number = 2;
const TARGET_GAP: number = 7;

// Keeps the card from hanging off the sides of the box it's drawn in.
const CARD_HALF_WIDTH: number = 116;

export interface GraphElements {
  nodes: Map<string, SVGGElement>;
  edges: Map<number, SVGLineElement>;
  view: SVGGElement | null;
  dots: HTMLDivElement | null;
  card: HTMLDivElement | null;
}

export const emptyElements = (): GraphElements => ({
  nodes: new Map(),
  edges: new Map(),
  view: null,
  dots: null,
  card: null
});

interface PaintGraphArgs {
  nodes: GraphNodeState[];
  links: GraphLink[];
  elements: GraphElements;
  view: GraphView;
  size: Size;
  // The node the card is open on, if any.
  openPath: string | undefined;
}

export const paintGraph = ({
  nodes,
  links,
  elements,
  view,
  size,
  openPath
}: PaintGraphArgs): void => {
  paintView({ elements, view, size });

  for (const node of nodes) {
    const element: SVGGElement | undefined = elements.nodes.get(node.path);
    if (element) element.setAttribute('transform', `translate(${round(node.x)} ${round(node.y)})`);
  }

  links.forEach((link, index) => paintEdge({ link, index, nodes, elements }));
  paintCard({ nodes, elements, view, size, openPath });
};

interface PaintViewArgs {
  elements: GraphElements;
  view: GraphView;
  size: Size;
}

// The pan/zoom transform, and the dot grid following it. The grid's origin is the middle of the
// box, so the dots belong to the graph's space while the light stays centered on the view.
const paintView = ({ elements, view, size }: PaintViewArgs): void => {
  elements.view?.setAttribute(
    'transform',
    `translate(${round(view.panX)} ${round(view.panY)}) scale(${view.zoom.toFixed(3)})`
  );

  if (!elements.dots) return;
  const spacing: number = DOT_SPACING * view.zoom;
  elements.dots.style.backgroundSize = `${spacing}px ${spacing}px`;
  elements.dots.style.backgroundPosition = `${round(size.width / 2 + view.panX)}px ${round(
    size.height / 2 + view.panY
  )}px`;
};

interface PaintEdgeArgs {
  link: GraphLink;
  index: number;
  nodes: GraphNodeState[];
  elements: GraphElements;
}

// Trimmed to the circles at both ends rather than drawn center to center, so the arrowhead lands on
// the edge of the target instead of underneath it.
const paintEdge = ({ link, index, nodes, elements }: PaintEdgeArgs): void => {
  const element: SVGLineElement | undefined = elements.edges.get(index);
  if (!element) return;

  const source: GraphNodeState = nodes[link.source];
  const target: GraphNodeState = nodes[link.target];
  const dx: number = target.x - source.x;
  const dy: number = target.y - source.y;
  const distance: number = Math.hypot(dx, dy) || 1;
  const unitX: number = dx / distance;
  const unitY: number = dy / distance;

  element.setAttribute('x1', round(source.x + unitX * (source.radius + SOURCE_GAP)));
  element.setAttribute('y1', round(source.y + unitY * (source.radius + SOURCE_GAP)));
  element.setAttribute('x2', round(target.x - unitX * (target.radius + TARGET_GAP)));
  element.setAttribute('y2', round(target.y - unitY * (target.radius + TARGET_GAP)));
};

interface PaintCardArgs extends PaintViewArgs {
  nodes: GraphNodeState[];
  openPath: string | undefined;
}

// The card is HTML over the svg, so it's moved in the box's own pixels — and it keeps following
// while the graph is still settling under it.
const paintCard = ({ nodes, elements, view, size, openPath }: PaintCardArgs): void => {
  if (!elements.card || !openPath) return;

  const node: GraphNodeState | undefined = nodes.find((candidate) => candidate.path === openPath);
  if (!node) return;

  const point = toLocal({ point: node, size, view });
  const x: number = clamp({
    value: point.x,
    low: CARD_HALF_WIDTH,
    high: Math.max(CARD_HALF_WIDTH, size.width - CARD_HALF_WIDTH)
  });

  elements.card.style.translate = `${round(x)}px ${round(point.y + node.radius * view.zoom)}px`;
};

interface ClampArgs {
  value: number;
  low: number;
  high: number;
}

const clamp = ({ value, low, high }: ClampArgs): number => Math.min(Math.max(value, low), high);

// Two decimals is under a tenth of a pixel and keeps the attribute strings short.
const round = (value: number): string => value.toFixed(2);
