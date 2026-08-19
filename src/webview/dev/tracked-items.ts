import { parseFrontmatter, Frontmatter } from '../../config/frontmatter';
import { Result } from '../../config/result';

// A note in `tracking/ideas/`. The id is the filename without `.md` — the name you say out loud
// to point at one, which is why the row carries a copy button for it and nothing else.
export interface TrackedItem {
  id: string;
  title: string;
  // The word the file actually wrote, not a normalized one — `built` and `done` both close an
  // item and the file gets to keep its own vocabulary.
  status: string;
  group: TrackedGroup;
  created: string | undefined;
  // `closed:` or `shipped:`, whichever the file used.
  closed: string | undefined;
  // Everything below the frontmatter, for the markdown pane.
  body: string;
}

export const TRACKED_GROUPS = ['open', 'closed'] as const;
export type TrackedGroup = (typeof TRACKED_GROUPS)[number];

// Only these words close an item. Anything unrecognized stays open rather than disappearing into
// the closed list — the same degrade-don't-crash rule the config loaders follow, and the failure
// that matters here is an item you stop seeing.
const CLOSED_WORDS: readonly string[] = ['built', 'done', 'shipped', 'closed'];

export const trackedGroup = (status: string): TrackedGroup =>
  CLOSED_WORDS.includes(status.toLowerCase()) ? 'closed' : 'open';

interface ToTrackedItemArgs {
  // The glob key, e.g. `../../../tracking/ideas/theme-pass-per-view.md`.
  path: string;
  raw: string;
}

// One file → one item. A file with no frontmatter still renders: it keeps its filename as the
// title and its whole text as the body, because a half-written note is the normal state of a
// tracking folder.
export const toTrackedItem = ({ path, raw }: ToTrackedItemArgs): TrackedItem => {
  const id: string = idFromPath(path);
  const parsed: Result<Frontmatter, string> = parseFrontmatter(raw);
  if (!parsed.ok) {
    return { id, title: id, status: 'open', group: 'open', created: undefined, closed: undefined, body: raw };
  }

  const status: string = scalar(parsed.value.fields.status) ?? 'open';

  return {
    id,
    title: scalar(parsed.value.fields.title) ?? id,
    status,
    group: trackedGroup(status),
    created: scalar(parsed.value.fields.created),
    closed: scalar(parsed.value.fields.closed) ?? scalar(parsed.value.fields.shipped),
    body: parsed.value.body
  };
};

const idFromPath = (path: string): string =>
  path.split('/').pop()?.replace(/\.md$/, '') ?? path;

// Frontmatter values can come back as lists; every field read here is a scalar, so a list is
// treated as absent rather than joined into a string that was never written.
const scalar = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;

// Newest first inside a group. Undated notes sort last rather than first — an item with no
// `created:` is the one nobody finished writing, not the one from the dawn of time.
export const sortTracked = (items: TrackedItem[]): TrackedItem[] =>
  [...items].sort((left, right) => (right.created ?? '').localeCompare(left.created ?? ''));
