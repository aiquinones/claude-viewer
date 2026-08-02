import { SCOPES, Scope, SkillEntry } from './types';

// Most specific scope wins a name collision, and SCOPES is in that order, so position is rank.
//
// ASSUMPTION, not yet verified against Claude Code itself — see
// tracking/ideas/verify-skill-precedence.md. It matches how settings layers resolve, but until
// it's tested the UI says so rather than stating it as fact.
export const scopeRank = (scope: Scope): number => SCOPES.indexOf(scope);

// Marks every losing skill with the path of the one that wins its name. Losers stay in the list —
// a skill you can't see is the problem this tool exists to fix.
interface FindSkillByNameArgs {
  skills: SkillEntry[];
  name: string;
  scope?: Scope;
}

// Resolves a name the way a deep link means it: the skill that actually runs. Pinning a scope
// reaches a shadowed copy on purpose, which is the only way to link to one.
export const findSkillByName = ({
  skills,
  name,
  scope
}: FindSkillByNameArgs): SkillEntry | undefined => {
  const named: SkillEntry[] = skills.filter((skill) => skill.name === name);
  if (scope) return named.find((skill) => skill.scope === scope);
  return named.find((skill) => !skill.shadowedBy) ?? named[0];
};

export const resolveShadowing = (skills: SkillEntry[]): SkillEntry[] => {
  const winners: Map<string, SkillEntry> = new Map();

  for (const skill of skills) {
    const current: SkillEntry | undefined = winners.get(skill.name);
    // Two skills at the same scope (say, two plugins) are a genuine tie; first one loaded holds it.
    if (!current || scopeRank(skill.scope) < scopeRank(current.scope)) {
      winners.set(skill.name, skill);
    }
  }

  return skills.map((skill) => {
    const winner: SkillEntry | undefined = winners.get(skill.name);
    if (!winner || winner.path === skill.path) return skill;
    return { ...skill, shadowedBy: winner.path };
  });
};
