// Anything that isn't a letter, a number, a space or a hyphen. Backticks and punctuation come
// along in a heading's raw text — `## Using `foo`` has to slug the same as `## Using foo`.
const DROPPED = /[^\p{L}\p{N}\s-]/gu;
const SPACES = /\s+/g;

// One heading's text → the name a link uses for it. GitHub's rule, because that's the one a reader
// already knows how to guess: lowercase, punctuation dropped, spaces to hyphens.
export const slugify = (text: string): string =>
  text.trim().toLowerCase().replace(DROPPED, '').replace(SPACES, '-').replace(/-+/g, '-');

// Two headings can say the same thing, so the second one gets `-2` the way GitHub does. `seen`
// counts how many times a slug has been handed out and is mutated as the tree is walked.
export const uniqueSlug = (args: { text: string; seen: Map<string, number> }): string => {
  const base: string = slugify(args.text);
  if (!base) return '';

  const count: number = (args.seen.get(base) ?? 0) + 1;
  args.seen.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
};
