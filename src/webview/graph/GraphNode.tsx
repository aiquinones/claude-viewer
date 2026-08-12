import { PointerEvent as ReactPointerEvent } from 'react';
import { SkillGraphNode } from '../../model/types';

// How a node is drawn depends on what it is right now, and only one of these can be true.
export type NodeState = 'viewed' | 'open' | 'related' | 'plain' | 'faded';

interface GraphNodeProps {
  node: SkillGraphNode;
  radius: number;
  state: NodeState;
  setElement: (element: SVGGElement | null) => void;
  // Drag, and a press that doesn't move opens the card — so there's no click handler here.
  onPointerDown: (event: ReactPointerEvent) => void;
  // Keyboard only: Enter on a focused node.
  onOpen: () => void;
  onHover: (path: string | undefined) => void;
}

// One circle and its name. The `<g>`'s transform is written by the frame loop, never by React —
// which is why nothing here knows where it is.
export const GraphNode = ({
  node,
  radius,
  state,
  setElement,
  onPointerDown,
  onOpen,
  onHover
}: GraphNodeProps) => (
  <g
    ref={setElement}
    role="button"
    tabIndex={0}
    aria-label={node.name}
    className={`graph-node graph-node-${state} cursor-grab focus:outline-none`}
    onPointerDown={onPointerDown}
    onKeyDown={(event) => event.key === 'Enter' && onOpen()}
    onPointerEnter={() => onHover(node.path)}
    onPointerLeave={() => onHover(undefined)}
  >
    {/* A ring outside the circle rather than a thicker stroke, so the viewed skill reads as marked
        rather than as a bigger node. */}
    {state === 'viewed' && <circle className="graph-ring" r={radius + 4} />}
    <circle className="graph-dot" r={radius} />
    <text className="graph-label" y={radius + 11} textAnchor="middle">
      {node.name}
    </text>
  </g>
);
