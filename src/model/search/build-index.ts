import { bySalience } from '../shadowing';
import { ConfigSnapshot, SearchDoc, SearchKind, SkillEntry } from '../types';

const WORD_BITS: number = 32;

interface MakeDocArgs {
  id: string;
  label: string;
  kind: SearchKind;
  rank: number;
  inactive?: boolean;
}

// Everything in the snapshot the spotlight can find, in the panel's own order so `rank` breaks
// score ties the way the lists already do. The next surface appends its own docs here.
export const buildSearchIndex = (snapshot: ConfigSnapshot): SearchDoc[] =>
  [...snapshot.skills].sort(bySalience).map((skill: SkillEntry, rank: number) =>
    makeDoc({
      id: skill.path,
      label: skill.name,
      kind: 'skill',
      rank,
      inactive: skill.shadowedBy !== undefined
    })
  );

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
