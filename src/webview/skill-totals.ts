import { SkillEntry } from '../model/types';

export interface ListingTotals {
  skills: number;
  chars: number;
  estimatedTokens: number;
}

// `listed` moved to model/shadowing.ts when the graph — built host-side — needed the same filter.

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
