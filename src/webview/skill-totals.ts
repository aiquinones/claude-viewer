import { SkillEntry } from '../model/types';

export interface ListingTotals {
  skills: number;
  chars: number;
}

// `listed` moved to model/shadowing.ts when the graph — built host-side — needed the same filter.

// What the name-and-description lines cost across a set of skills. Chars, not tokens: the caller
// estimates the sum once, under whichever estimator is set. Estimating the sum and summing the
// estimates differ only by rounding, and the first is the more defensible of the two.
export const listingTotals = (skills: SkillEntry[]): ListingTotals =>
  skills.reduce(
    (running: ListingTotals, skill) => ({
      skills: running.skills + 1,
      chars: running.chars + skill.listingChars
    }),
    { skills: 0, chars: 0 }
  );
