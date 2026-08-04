import { SearchDoc, SearchHit } from '../types';

// What a match is worth. One table, so tuning the feel is one file. Negatives are penalties and
// are added like everything else.
const SCORE = {
  startOfLabel: 40,
  wordBoundary: 25,
  adjacentToPrevious: 20,
  wholeLabel: 100,
  perCharacterBeforeTheMatch: -2,
  perCharacterSkippedInside: -1,
  perCharacterOfLabel: -0.25
} as const;

const BOUNDARIES: Set<string> = new Set(['-', '_', '.', ' ', '/']);

interface MatchDocArgs {
  doc: SearchDoc;
  // Already lowercased — searchIndex does it once for the whole run.
  query: string;
}

// Leftmost-greedy subsequence match: `pm` matches `post-mortem`. Undefined means the query isn't a
// subsequence of the label at all.
export const matchDoc = ({ doc, query }: MatchDocArgs): SearchHit | undefined => {
  const positions: number[] = [];
  let cursor: number = 0;

  for (let i = 0; i < query.length; i++) {
    const mask: number[] | undefined = doc.masks.get(query[i]);
    if (!mask) return undefined;

    const at: number = nextIndex({ mask, from: cursor });
    if (at < 0) return undefined;

    positions.push(at);
    cursor = at + 1;
  }

  return { doc, positions, score: scoreMatch({ doc, positions }) };
};

interface NextIndexArgs {
  mask: number[];
  from: number;
}

// The lowest set position at or after `from`, or -1. The whole matcher is this in a loop, which is
// why a name's length costs nothing per query character.
const nextIndex = ({ mask, from }: NextIndexArgs): number => {
  let word: number = from >> 5;
  if (word >= mask.length) return -1;

  // `-1 << (from & 31)` clears the positions already passed; at a word boundary it keeps them all.
  let bits: number = mask[word] & (-1 << (from & 31));
  while (bits === 0) {
    word += 1;
    if (word >= mask.length) return -1;
    bits = mask[word];
  }

  return (word << 5) + lowestSetBit(bits);
};

// Isolate the lowest set bit, then read its position off clz32 — count-trailing-zeros in two ops.
const lowestSetBit = (bits: number): number => 31 - Math.clz32(bits & -bits);

interface ScoreMatchArgs {
  doc: SearchDoc;
  positions: number[];
}

// Leftmost-greedy finds *a* match, not the prettiest one, so the score is what sorts the list.
const scoreMatch = ({ doc, positions }: ScoreMatchArgs): number => {
  let score: number = doc.haystack.length * SCORE.perCharacterOfLabel;

  positions.forEach((position, index) => {
    if (position === 0) score += SCORE.startOfLabel;
    else if (BOUNDARIES.has(doc.haystack[position - 1])) score += SCORE.wordBoundary;
    if (index > 0 && position === positions[index - 1] + 1) score += SCORE.adjacentToPrevious;
  });

  const first: number = positions[0];
  const span: number = positions[positions.length - 1] - first + 1;
  score += first * SCORE.perCharacterBeforeTheMatch;
  score += (span - positions.length) * SCORE.perCharacterSkippedInside;
  if (positions.length === doc.haystack.length) score += SCORE.wholeLabel;

  return score;
};
