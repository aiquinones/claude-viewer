import { SearchDoc, SearchHit } from '../types';
import { matchDoc } from './match';

// How many results the spotlight shows. One number, one place.
export const SEARCH_LIMIT: number = 5;

interface SearchIndexArgs {
  index: SearchDoc[];
  query: string;
  limit?: number;
}

// Every doc the query matches, best first, capped. An empty query matches nothing: the box is a
// prompt to type, not a list to dismiss.
export const searchIndex = ({ index, query, limit = SEARCH_LIMIT }: SearchIndexArgs): SearchHit[] => {
  const needle: string = query.trim().toLowerCase();
  if (needle.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const doc of index) {
    const hit: SearchHit | undefined = matchDoc({ doc, query: needle });
    if (hit) hits.push(hit);
  }

  return hits.sort(byScore).slice(0, limit);
};

// Score first, then the order the panel already lists things in.
const byScore = (left: SearchHit, right: SearchHit): number =>
  right.score - left.score || left.doc.rank - right.doc.rank;
