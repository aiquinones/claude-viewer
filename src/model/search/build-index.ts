import { bySalience } from '../shadowing';
import { ConfigSnapshot, MemoryEntry, SearchDoc, SearchKind, SkillEntry } from '../types';

const WORD_BITS: number = 32;

// A doc before it's chewed up. `rank` is position in the whole index, so it's assigned once at the
// end rather than per surface.
interface DocSeed {
  id: string;
  label: string;
  kind: SearchKind;
  inactive?: boolean;
}

interface MakeDocArgs extends DocSeed {
  rank: number;
}

// One of the panel's own surfaces, as the index needs it. `SURFACES` lives in the webview and
// model/ can't import it, so the caller hands over the two fields that matter — and the id it
// passes is the one it gets back to navigate with.
export interface SearchView {
  id: string;
  title: string;
  // Not built yet: the row dims, and choosing it says so rather than opening anything.
  soon?: boolean;
}

interface BuildSearchIndexArgs {
  snapshot: ConfigSnapshot;
  views?: SearchView[];
}

// Everything the spotlight can find, in the panel's own order so `rank` breaks score ties the way
// the lists already do: the places first, then what's inside them. The next surface appends its
// own seeds here.
export const buildSearchIndex = ({ snapshot, views = [] }: BuildSearchIndexArgs): SearchDoc[] =>
  [
    ...viewSeeds(views),
    ...skillSeeds(snapshot.skills),
    ...memorySeeds(snapshot.memory?.memories ?? [])
  ].map((seed, rank) => makeDoc({ ...seed, rank }));

// The surfaces themselves. Their ids can't collide with a skill's or a memory's, which are
// absolute paths.
const viewSeeds = (views: SearchView[]): DocSeed[] =>
  views.map((view) => ({
    id: view.id,
    label: view.title,
    kind: 'view',
    inactive: view.soon
  }));

// A memory nothing points at is `inactive` for the same reason a shadowed skill is: it's on disk
// and no session will read it.
const memorySeeds = (memories: MemoryEntry[]): DocSeed[] =>
  memories.map((memory) => ({
    id: memory.path,
    label: memory.name,
    kind: 'memory',
    inactive: !memory.indexed
  }));

const skillSeeds = (skills: SkillEntry[]): DocSeed[] =>
  [...skills].sort(bySalience).map((skill) => ({
    id: skill.path,
    label: skill.name,
    kind: 'skill',
    inactive: skill.shadowedBy !== undefined
  }));

// One pass over the label, setting a bit per character position. Everything the matcher does is a
// bit op against these, so a name is never scanned again once it's indexed.
const makeDoc = ({ id, label, kind, rank, inactive }: MakeDocArgs): SearchDoc => {
  const haystack: string = label.toLowerCase();
  const words: number = Math.ceil(haystack.length / WORD_BITS);
  const masks: Map<string, number[]> = new Map();

  for (let i = 0; i < haystack.length; i++) {
    const character: string = haystack[i];
    const mask: number[] = masks.get(character) ?? new Array<number>(words).fill(0);
    mask[i >> 5] |= 1 << i % WORD_BITS;
    masks.set(character, mask);
  }

  return { id, label, kind, haystack, masks, rank, inactive };
};
