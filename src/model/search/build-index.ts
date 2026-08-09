import { bySalience } from '../shadowing';
import { ConfigSnapshot, SearchDoc, SearchKind, SkillEntry } from '../types';

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

// Everything in the snapshot the spotlight can find, in the panel's own order so `rank` breaks
// score ties the way the lists already do. The next surface appends its own seeds here.
export const buildSearchIndex = (snapshot: ConfigSnapshot): SearchDoc[] =>
  skillSeeds(snapshot.skills).map((seed, rank) => makeDoc({ ...seed, rank }));

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
