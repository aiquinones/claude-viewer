import { Scope, SkillEntry } from './types';

// Most specific scope wins a name collision.
//
// ASSUMPTION, not yet verified against Claude Code itself — see
// tracking/ideas/verify-skill-precedence.md. It matches how settings layers resolve, but until
// it's tested the UI says so rather than stating it as fact.
const SCOPE_RANK: Record<Scope, number> = { project: 0, user: 1, plugin: 2 };

export const scopeRank = (scope: Scope): number => SCOPE_RANK[scope];

// Marks every losing skill with the path of the one that wins its name. Losers stay in the list —
// a skill you can't see is the problem this tool exists to fix.
export const resolveShadowing = (skills: SkillEntry[]): SkillEntry[] => {
  const winners: Map<string, SkillEntry> = new Map();

  for (const skill of skills) {
    const current: SkillEntry | undefined = winners.get(skill.name);
    // Two skills at the same scope (say, two plugins) are a genuine tie; first one loaded holds it.
    if (!current || SCOPE_RANK[skill.scope] < SCOPE_RANK[current.scope]) {
      winners.set(skill.name, skill);
    }
  }

  return skills.map((skill) => {
    const winner: SkillEntry | undefined = winners.get(skill.name);
    if (!winner || winner.path === skill.path) return skill;
    return { ...skill, shadowedBy: winner.path };
  });
};
