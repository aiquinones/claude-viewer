import { Section } from './sections';
import { slugify } from './slug';

// A section a link landed on. The slug is the resolved one — `resolveSection` has already run, so
// everything downstream matches on equality and only one place knows the rules. The nonce is what
// makes the same link twice a second event rather than a no-op, same as `Reveal` carries one.
export interface SectionTarget {
  slug: string;
  nonce: number;
}

const DIGITS = /^\d+$/;

interface ResolveSectionArgs {
  sections: Section[];
  target: string;
}

// What a link named → the slug of the section it lands on, or undefined if nothing fits. Three
// rules in order, each looser than the last, because a slug breaks the moment someone rewords a
// heading and a skill being actively fixed gets reworded often:
//
//   exact slug        `#7-release-the-worktree`
//   a run of words    `#7` or `#release-the-worktree` → 7. Release the worktree
//   digits → ordinal  `#3` → the 3rd heading, when no heading has a 3 in it
//
// The middle rule is why the ordinal rarely fires: a numbered skill answers `#7` with step 7 rather
// than the 7th heading, which is what someone writing `#7` meant. Both failure modes are visible —
// you land somewhere, and the bar says which heading it is.
export const resolveSection = ({ sections, target }: ResolveSectionArgs): string | undefined => {
  // Through the same slugifier the headings went through, so a link that spells the heading out
  // — `#Release the worktree` — is the same ask as one that spells the slug.
  const wanted: string = slugify(target);
  if (!wanted) return undefined;

  const headings: Section[] = flatten(sections);

  const exact: Section | undefined = headings.find((section) => section.slug === wanted);
  if (exact) return exact.slug;

  const words: string[] = wanted.split('-');
  const partial: Section | undefined = headings.find((section) => contains(section.slug, words));
  if (partial) return partial.slug;

  if (!DIGITS.test(wanted)) return undefined;
  return headings[Number(wanted) - 1]?.slug;
};

// Whether the heading's slug contains these words, in order and next to each other. Whole words
// rather than a substring: `test` should not land you on "Latest changes", and the only reason
// this is looser than a prefix is the ordinal — `release-the-worktree` has to still find
// `7-release-the-worktree` after someone renumbers the steps.
const contains = (slug: string, words: string[]): boolean => {
  const parts: string[] = slug.split('-');

  for (let start = 0; start + words.length <= parts.length; start += 1) {
    if (words.every((word, offset) => parts[start + offset] === word)) return true;
  }

  return false;
};

// Every headed section, in document order — a heading's own sub-sections before the next heading
// beside it, which is the order the ordinal counts in.
const flatten = (sections: Section[]): Section[] =>
  sections.flatMap((section) => (section.heading ? [section, ...flatten(section.children)] : []));
