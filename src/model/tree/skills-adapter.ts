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

// Skills → scope → skill. The tree is a hierarchy widget and scope is the hierarchy the data
// actually has, so nesting it means shadowing shows up as structure: the same name appears under
// two groups, which reads as a collision instead of as a duplicated row.
//
// Groups come back in SCOPES order, which is precedence order — top to bottom is who wins.
// Folding a group is how you hide a scope; there is no filter, and the group row keeps its count
// while folded, which a filter couldn't do.
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

// A scope with no skills still gets a row when the scope itself exists — "user · none" is a
// different fact from user scope not being searched, and this tool is about the difference.
// Plugin scope is the exception: with no plugins installed there is no directory to speak of.
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
    // Plugin skills are the ones you're least often looking for and the biggest group by far, so
    // the surface opens readable instead of as a wall.
    collapsed: scope === 'plugin'
  };
};

// Project scope only exists when a folder is open — no folder is a normal state, not an empty
// project. User scope always exists; plugin scope is only real once a plugin ships skills.
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

// Scope moved to the group row, which frees the description to say something the row couldn't say
// before: which scope took the name.
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
  // Which plugin a skill came from is the one thing the group row can't already tell you.
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

// A row can name the winning scope but not show the resolution, so the tooltip points at the panel
// rather than stating something it doesn't have room to back up.
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
