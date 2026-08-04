import {
  ConfigIssue,
  ConfigSnapshot,
  SCOPES,
  Scope,
  SkillEntry,
  SurfaceArgs,
  TreeNode,
  TreeNodeIcon
} from '../types';

// Skills → scope → skill, in SCOPES order so top to bottom is precedence.
// Nesting is what makes a shadowed skill read as a collision rather than a duplicated row.
export const skillsNode = ({ snapshot }: SurfaceArgs): TreeNode => {
  const groups: TreeNode[] = SCOPES.map((scope) => scopeGroup({ snapshot, scope })).filter(
    (group): group is TreeNode => group !== undefined
  );

  return {
    id: 'surface:skills',
    label: 'Skills',
    description: snapshot.skills.length === 0 ? 'none found' : `${snapshot.skills.length}`,
    children: groups
  };
};

interface ScopeGroupArgs {
  snapshot: ConfigSnapshot;
  scope: Scope;
}

// An empty scope still gets a row when the scope exists — "nothing in it" and "not searched"
// are different facts.
const scopeGroup = ({ snapshot, scope }: ScopeGroupArgs): TreeNode | undefined => {
  const inScope: SkillEntry[] = snapshot.skills.filter((skill) => skill.scope === scope);
  if (inScope.length === 0 && !scopeExists({ snapshot, scope })) return undefined;

  const sorted: SkillEntry[] = [...inScope].sort((left, right) =>
    left.name.localeCompare(right.name)
  );
  const shadowed: number = inScope.filter((skill) => skill.shadowedBy).length;

  return {
    id: `scope:${scope}`,
    label: scope,
    description: groupDescription({ count: inScope.length, shadowed }),
    children: sorted.map((skill) => skillNode({ skill, snapshot })),
    // Biggest group, least often wanted.
    collapsed: scope === 'plugin'
  };
};

// Project scope needs an open folder; user scope always exists; plugin scope only once one
// ships skills.
const scopeExists = ({ snapshot, scope }: ScopeGroupArgs): boolean => {
  if (scope === 'project') return snapshot.workspaceRoot !== undefined;
  if (scope === 'user') return true;
  return false;
};

interface GroupDescriptionArgs {
  count: number;
  shadowed: number;
}

const groupDescription = ({ count, shadowed }: GroupDescriptionArgs): string => {
  if (count === 0) return 'none';
  return shadowed > 0 ? `${count} · ${shadowed} shadowed` : `${count}`;
};

interface SkillNodeArgs {
  skill: SkillEntry;
  snapshot: ConfigSnapshot;
}

// Scope lives on the group row now, so the description can name the winner instead.
const skillNode = ({ skill, snapshot }: SkillNodeArgs): TreeNode => ({
  id: skill.path,
  label: skill.name,
  description: skillDescription({ skill, snapshot }),
  tooltip: tooltip({ skill, snapshot }),
  icon: icon(skill),
  revealPath: skill.path
});

const skillDescription = ({ skill, snapshot }: SkillNodeArgs): string | undefined => {
  const winner: SkillEntry | undefined = winnerOf({ skill, snapshot });
  if (winner) return `shadowed by ${winner.scope}`;
  // The one thing the group row can't say.
  return skill.pluginName;
};

const winnerOf = ({ skill, snapshot }: SkillNodeArgs): SkillEntry | undefined =>
  skill.shadowedBy
    ? snapshot.skills.find((other) => other.path === skill.shadowedBy)
    : undefined;

// An unreadable SKILL.md outranks being shadowed; a missing description doesn't.
const icon = (skill: SkillEntry): TreeNodeIcon | undefined => {
  if (skill.issues.some((issue) => issue.severity === 'error')) return 'error';
  if (skill.shadowedBy) return 'shadowed';
  if (skill.issues.length > 0) return 'warning';
  return undefined;
};

// A row names the winner but can't show the resolution, so this points at the panel.
const tooltip = ({ skill, snapshot }: SkillNodeArgs): string => {
  const lines: string[] = [skill.description || 'No description.'];
  const winner: SkillEntry | undefined = winnerOf({ skill, snapshot });

  if (winner) {
    lines.push(`Shadowed by the ${winner.scope} copy — open for the resolution.`);
  }
  for (const issue of skill.issues) lines.push(issueLine(issue));

  return lines.join('\n\n');
};

const issueLine = (issue: ConfigIssue): string =>
  `${issue.severity === 'error' ? 'Error' : 'Warning'}: ${issue.message}`;
