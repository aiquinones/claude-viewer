import { SkillEntry, SkillGraph, SkillGraphEdge, SkillGraphNode } from '../types';
import { findMentions } from './mentions';

// One skill and the text a mention can hide in. The host reads the bodies; this file only counts.
export interface SkillText {
  skill: SkillEntry;
  // SKILL.md below its frontmatter. Empty when the file couldn't be read — no body, no edges.
  body: string;
}

interface BuildSkillGraphArgs {
  // Listed skills only. A shadowed one never runs, so its relationships don't exist.
  texts: SkillText[];
  loadedAt: number;
}

// Every skill's text scanned for every other skill's name, then everything an edge never touched
// is dropped: an install is mostly unrelated skills, and a rim of loose dots says nothing the
// surface header didn't already say.
export const buildSkillGraph = ({ texts, loadedAt }: BuildSkillGraphArgs): SkillGraph => {
  // One entry per name — shadowing already picked a winner, so a name can't be ambiguous here.
  const byName: Map<string, SkillEntry> = new Map(
    texts.map(({ skill }) => [skill.name.toLowerCase(), skill])
  );
  const names: string[] = [...byName.keys()];

  const edges: SkillGraphEdge[] = texts.flatMap(({ skill, body }) =>
    edgesFrom({ skill, body, names, byName })
  );

  const connected: Set<string> = new Set(edges.flatMap((edge) => [edge.from, edge.to]));

  return {
    nodes: texts.filter(({ skill }) => connected.has(skill.path)).map(({ skill }) => toNode(skill)),
    edges,
    loadedAt
  };
};

interface EdgesFromArgs extends SkillText {
  names: string[];
  byName: Map<string, SkillEntry>;
}

// The description counts as much as the body — "use after /create-pr" is a reference wherever it
// sits, and the description is the part Claude reads on every request.
const edgesFrom = ({ skill, body, names, byName }: EdgesFromArgs): SkillGraphEdge[] => {
  const mentions: Map<string, number> = findMentions({
    text: `${skill.description}\n${body}`,
    names
  });

  const edges: SkillGraphEdge[] = [];
  for (const [name, weight] of mentions) {
    const target: SkillEntry | undefined = byName.get(name);
    if (!target || target.path === skill.path) continue;
    edges.push({ from: skill.path, to: target.path, weight });
  }

  return edges;
};

const toNode = (skill: SkillEntry): SkillGraphNode => ({
  path: skill.path,
  name: skill.name,
  description: skill.description,
  scope: skill.scope,
  pluginName: skill.pluginName
});
