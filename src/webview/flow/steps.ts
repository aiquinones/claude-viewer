import { Token } from 'marked';
import { listed } from '../../model/shadowing';
import { findMentions } from '../../model/skill-graph/mentions';
import { SkillEntry } from '../../model/types';
import { Section, toSections } from '../markdown/sections';
import { sectionText } from './section-text';

// A step and a sub-section are the same thing at different depths, which is what makes the detail
// pane's drill-down recursive rather than two components that nearly agree.
export interface FlowNode {
  // Position in the tree, dotted — "2", "2.0". What the focus trail holds onto.
  id: string;
  // The heading's own anchor, carried through from the section so a link naming a heading can be
  // matched against the steps as well as against the text.
  slug: string;
  // The heading with any ordinal stripped — a card carries its number in its own badge, and
  // "1 · 1. Read the state" reads like a bug.
  label: string;
  // This node's own content, not its children's.
  blocks: Token[];
  children: FlowNode[];
  // Every section below this one, at any depth.
  descendantCount: number;
  // Skills named anywhere in this node's subtree, most-mentioned first.
  skills: FlowSkillRef[];
}

export interface FlowSkillRef {
  skill: SkillEntry;
  count: number;
}

// Which rule found the steps. The view counts them either way — this is what its caption reads.
export type FlowSource = 'numbered' | 'sections';

export interface SkillFlow {
  steps: FlowNode[];
  source: FlowSource;
}

// One step isn't a sequence. Below this there's nothing to draw that the text view doesn't say
// better.
const MIN_STEPS: number = 2;

// A heading that announces its place in a sequence: `3.`, `3)`, `3 —`, `Step 3:`. Measured against
// the thirteen skills in a real ~/.claude/skills — ten of them are written this way.
const NUMBERED: RegExp = /^\s*(?:step\s+)?\d+\s*[.):—–-]/i;

interface ToSkillFlowArgs {
  // SKILL.md below its frontmatter.
  raw: string;
  // Every skill in the snapshot. Shadowed ones are dropped here — one never runs, so a reference
  // to its name resolves to whichever copy won.
  skills: SkillEntry[];
  // The skill being viewed, so it doesn't reference itself.
  selfPath: string | undefined;
}

// A SKILL.md's steps, in order, each carrying its own sub-sections and the skills it names.
// Undefined when the file has no sequence in it — which dims the toggle rather than drawing one
// box.
export const toSkillFlow = ({ raw, skills, selfPath }: ToSkillFlowArgs): SkillFlow | undefined => {
  const sections: Section[] = toSections(raw);

  const numbered: Section[] = collect({ sections, matches: isNumbered });
  const source: FlowSource = numbered.length >= MIN_STEPS ? 'numbered' : 'sections';
  const steps: Section[] = source === 'numbered' ? numbered : branchingLevel(sections);
  if (steps.length < MIN_STEPS) return undefined;

  const byName: Map<string, SkillEntry> = new Map(
    listed(skills)
      .filter((skill) => skill.path !== selfPath && skill.name)
      .map((skill) => [skill.name.toLowerCase(), skill])
  );
  const names: string[] = [...byName.keys()];

  return {
    steps: steps.map((section, index) => toNode({ section, id: String(index), names, byName })),
    source
  };
};

const isNumbered = (section: Section): boolean => NUMBERED.test(section.heading?.text ?? '');

// "3. Commit" → "Commit". Leaves an unnumbered heading alone, so the fallback source is unaffected.
const stripOrdinal = (label: string): string => label.replace(NUMBERED, '').trim();

interface CollectArgs {
  sections: Section[];
  matches: (section: Section) => boolean;
}

// Pre-order, and a match is not descended into: a numbered heading under a numbered heading is
// that step's sub-section, not a second entry in the sequence.
//
// Depth deliberately isn't part of the rule. `create-pr` writes steps 1–5 under one `##` and
// step 6 under a different one — "the children of whichever heading has numbered children" finds
// five of the six, and document order finds all of them.
const collect = ({ sections, matches }: CollectArgs): Section[] => {
  const found: Section[] = [];

  for (const section of sections) {
    if (section.heading && matches(section)) {
      found.push(section);
      continue;
    }
    found.push(...collect({ sections: section.children, matches }));
  }

  return found;
};

// The shallowest level holding more than one section — the fallback when nothing is numbered. A
// file that opens with a single `#` title has its sections one level down, so stopping at the
// roots would find a flow of one and give up.
const branchingLevel = (sections: Section[]): Section[] => {
  let level: Section[] = headed(sections);

  while (level.length === 1) {
    const next: Section[] = headed(level[0].children);
    if (next.length === 0) return level;
    level = next;
  }

  return level;
};

// Skips the one section that holds whatever came before the first heading — it has no name, so it
// can't be a step.
const headed = (sections: Section[]): Section[] => sections.filter((section) => section.heading);

interface ToNodeArgs {
  section: Section;
  id: string;
  names: string[];
  byName: Map<string, SkillEntry>;
}

const toNode = ({ section, id, names, byName }: ToNodeArgs): FlowNode => {
  const children: FlowNode[] = section.children.map((child, index) =>
    toNode({ section: child, id: `${id}.${index}`, names, byName })
  );

  return {
    id,
    slug: section.slug,
    label: stripOrdinal(section.heading?.text ?? ''),
    blocks: section.blocks,
    children,
    descendantCount: children.reduce((total, child) => total + 1 + child.descendantCount, 0),
    skills: skillsIn({ section, names, byName })
  };
};

interface SkillsInArgs {
  section: Section;
  names: string[];
  byName: Map<string, SkillEntry>;
}

// The whole subtree, so a step's summary counts what you'd find by opening it. `findMentions` is
// the graph's scanner — it already knows that "spec/design doc" isn't a reference to /design, and
// a second rule here would drift from that one within a release.
const skillsIn = ({ section, names, byName }: SkillsInArgs): FlowSkillRef[] => {
  const mentions: Map<string, number> = findMentions({ text: sectionText(section), names });

  const refs: FlowSkillRef[] = [];
  for (const [name, count] of mentions) {
    const skill: SkillEntry | undefined = byName.get(name);
    if (skill) refs.push({ skill, count });
  }

  return refs.sort((left, right) => right.count - left.count);
};
