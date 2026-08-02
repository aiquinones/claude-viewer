import { ConfigIssue, SkillEntry, SurfaceArgs, TreeNode, TreeNodeIcon } from '../types';

// The skills surface as one collapsible row. Flat and alphabetical underneath: the tree is for
// jumping to a name you already know, and VS Code's own filter searches labels. Scope lives in the
// dimmed description, where the panel puts grouping instead.
export const skillsNode = ({ snapshot, visibleScopes }: SurfaceArgs): TreeNode => {
  const visible: SkillEntry[] = snapshot.skills.filter((skill) =>
    visibleScopes.includes(skill.scope)
  );
  const sorted: SkillEntry[] = [...visible].sort((left, right) =>
    left.name.localeCompare(right.name)
  );

  return {
    id: 'surface:skills',
    label: 'Skills',
    description: rootDescription({ snapshot, visible }),
    children: sorted.map(skillNode)
  };
};

interface RootDescriptionArgs {
  snapshot: SurfaceArgs['snapshot'];
  visible: SkillEntry[];
}

const rootDescription = ({ snapshot, visible }: RootDescriptionArgs): string => {
  const total: number = snapshot.skills.length;
  if (total === 0) return 'none found';
  // Says the count is filtered rather than letting hidden scopes look like missing skills.
  if (visible.length !== total) return `${visible.length} of ${total}`;
  return `${total}`;
};

const skillNode = (skill: SkillEntry): TreeNode => ({
  id: skill.path,
  label: skill.name,
  description: skill.shadowedBy ? 'shadowed' : scopeLabel(skill),
  tooltip: tooltip(skill),
  icon: icon(skill),
  revealPath: skill.path
});

const scopeLabel = (skill: SkillEntry): string =>
  skill.pluginName ? `plugin · ${skill.pluginName}` : skill.scope;

// An unreadable SKILL.md outranks being shadowed; a missing description doesn't.
const icon = (skill: SkillEntry): TreeNodeIcon | undefined => {
  if (skill.issues.some((issue) => issue.severity === 'error')) return 'error';
  if (skill.shadowedBy) return 'shadowed';
  if (skill.issues.length > 0) return 'warning';
  return undefined;
};

// A row can say a skill is shadowed but never why, so the tooltip points at the panel instead of
// stating a resolution it doesn't have room to show.
const tooltip = (skill: SkillEntry): string => {
  const lines: string[] = [skill.description || 'No description.'];

  if (skill.shadowedBy) {
    lines.push(`Shadowed by another ${skill.name} — open for the resolution.`);
  }
  for (const issue of skill.issues) lines.push(issueLine(issue));

  return lines.join('\n\n');
};

const issueLine = (issue: ConfigIssue): string =>
  `${issue.severity === 'error' ? 'Error' : 'Warning'}: ${issue.message}`;
