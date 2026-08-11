import { SkillEntry } from '../model/types';

export interface ListingTotals {
  skills: number;
  chars: number;
  estimatedTokens: number;
}

// A shadowed skill never reaches the system prompt — the winner's line is the one Claude reads —
// so it costs nothing and doesn't count. Same idea as `alwaysLoads` on the prompt surface: the
// headline number should be what you actually pay.
export const listed = (skills: SkillEntry[]): SkillEntry[] =>
  skills.filter((skill) => !skill.shadowedBy);

// What the name-and-description lines cost across a set of skills.
export const listingTotals = (skills: SkillEntry[]): ListingTotals =>
  skills.reduce(
    (running: ListingTotals, skill) => ({
      skills: running.skills + 1,
      chars: running.chars + skill.listingChars,
      estimatedTokens: running.estimatedTokens + skill.listingEstimatedTokens
    }),
    { skills: 0, chars: 0, estimatedTokens: 0 }
  );
