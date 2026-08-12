import { useMemo, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { SkillGraph, SkillGraphNode } from '../../model/types';
import { Tooltip } from '../Tooltip';
import { GraphCard } from './GraphCard';
import { GraphNode, NodeState } from './GraphNode';
import { ForceGraph, useForceGraph } from './useForceGraph';

interface GraphViewProps {
  graph: SkillGraph;
  // The skill the panel is showing. Marked with a ring, whatever else is going on.
  viewedPath: string | undefined;
  onOpenSkill: (path: string) => void;
}

// Who mentions whom, drawn. The layers are stacked rather than nested: dots and light are CSS
// behind an svg that owns the graph, and the card is HTML on top of both.
export const GraphView = ({ graph, viewedPath, onOpenSkill }: GraphViewProps) => {
  const [openPath, setOpenPath] = useState<string | undefined>(undefined);
  const [hoverPath, setHoverPath] = useState<string | undefined>(undefined);

  const force: ForceGraph = useForceGraph({ graph, openPath });
  const neighbors: Set<string> = useMemo(
    () => neighborsOf({ graph, path: hoverPath }),
    [graph, hoverPath]
  );

  const open: SkillGraphNode | undefined = graph.nodes.find((node) => node.path === openPath);
  const width: number = force.size.width;
  const height: number = force.size.height;

  return (
    <div
      ref={force.boxRef}
      className="graph-box relative h-[min(70vh,32rem)] min-h-72 w-full overflow-hidden rounded-lg border border-border"
    >
      <div className="graph-glow pointer-events-none absolute inset-0" />
      <div ref={force.setDotsElement} className="graph-dots pointer-events-none absolute inset-0" />

      {width > 0 && (
        <svg
          width={width}
          height={height}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          className="absolute inset-0 cursor-grab"
          onPointerDown={(event) => {
            setOpenPath(undefined);
            force.panBackground(event);
          }}
          onDoubleClick={force.resetView}
        >
          <defs>
            {/* `context-stroke` is what makes an arrowhead take the colour of the line it ends,
                so a highlighted edge doesn't keep a grey tip. */}
            <marker
              id="graph-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L8,4 L0,8 z" fill="context-stroke" />
            </marker>
          </defs>

          <g ref={force.setViewElement}>
            {graph.edges.map((edge, index) => (
              <line
                key={`${edge.from}→${edge.to}`}
                ref={force.setEdgeElement(index)}
                markerEnd="url(#graph-arrow)"
                className={`graph-edge graph-edge-${edgeState({
                  edge,
                  hoverPath,
                  viewedPath
                })}`}
              />
            ))}

            {graph.nodes.map((node, index) => (
              <GraphNode
                key={node.path}
                node={node}
                radius={force.layout.nodes[index].radius}
                state={nodeState({ path: node.path, hoverPath, viewedPath, openPath, neighbors })}
                setElement={force.setNodeElement(node.path)}
                onPointerDown={(event) =>
                  force.dragNode({ event, path: node.path, onTap: () => setOpenPath(node.path) })
                }
                onOpen={() => setOpenPath(node.path)}
                onHover={setHoverPath}
              />
            ))}
          </g>
        </svg>
      )}

      {open && (
        <GraphCard
          node={open}
          setElement={force.setCardElement}
          onOpenSkill={onOpenSkill}
          onClose={() => setOpenPath(undefined)}
        />
      )}

      <span className="pointer-events-none absolute bottom-2 left-3 text-[0.6875rem] text-muted-foreground/70">
        drag a node to shake it · ⌘ or ctrl + scroll to zoom
      </span>
      <div className="absolute bottom-2 right-2">
        <Tooltip label="Reset the view">
          <button
            type="button"
            aria-label="Reset the view"
            onClick={force.resetView}
            className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground hover:text-foreground"
          >
            <Maximize2 className="size-3" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

interface NeighborsOfArgs {
  graph: SkillGraph;
  path: string | undefined;
}

const neighborsOf = ({ graph, path }: NeighborsOfArgs): Set<string> => {
  const found: Set<string> = new Set();
  if (!path) return found;

  for (const edge of graph.edges) {
    if (edge.from === path) found.add(edge.to);
    if (edge.to === path) found.add(edge.from);
  }
  return found;
};

interface NodeStateArgs {
  path: string;
  hoverPath: string | undefined;
  viewedPath: string | undefined;
  openPath: string | undefined;
  neighbors: Set<string>;
}

// The skill you're reading keeps its ring through everything else — it's the one thing the graph is
// answering "where am I" with.
const nodeState = ({
  path,
  hoverPath,
  viewedPath,
  openPath,
  neighbors
}: NodeStateArgs): NodeState => {
  if (path === viewedPath) return 'viewed';
  if (hoverPath) {
    if (path === hoverPath) return 'open';
    return neighbors.has(path) ? 'related' : 'faded';
  }
  if (path === openPath) return 'open';
  return 'plain';
};

interface EdgeStateArgs {
  edge: { from: string; to: string };
  hoverPath: string | undefined;
  viewedPath: string | undefined;
}

const edgeState = ({ edge, hoverPath, viewedPath }: EdgeStateArgs): string => {
  const touches = (path: string | undefined): boolean =>
    Boolean(path) && (edge.from === path || edge.to === path);

  if (hoverPath) return touches(hoverPath) ? 'active' : 'faded';
  return touches(viewedPath) ? 'active' : 'plain';
};
