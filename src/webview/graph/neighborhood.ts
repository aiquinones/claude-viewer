import { SkillGraph, SkillGraphEdge } from '../../model/types';

interface NeighborhoodArgs {
  graph: SkillGraph;
  // The skill being viewed. Undefined draws the whole graph, which only happens in a story.
  path: string | undefined;
}

// One skill and what it names, plus what names it. The whole graph is the wrong picture when
// you're reading one skill: the rest of it is someone else's neighbourhood, and it crowds out the
// three edges you came to see.
//
// Edges *between* the neighbours are kept — if two of them also reference each other, that's part
// of the shape around this skill.
export const neighborhood = ({ graph, path }: NeighborhoodArgs): SkillGraph => {
  if (!path) return graph;

  const kept: Set<string> = new Set([path]);
  for (const edge of graph.edges) {
    if (edge.from === path) kept.add(edge.to);
    if (edge.to === path) kept.add(edge.from);
  }

  const edges: SkillGraphEdge[] = graph.edges.filter(
    (edge) => kept.has(edge.from) && kept.has(edge.to)
  );

  return {
    nodes: graph.nodes.filter((node) => kept.has(node.path)),
    edges,
    loadedAt: graph.loadedAt
  };
};
