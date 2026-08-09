import { SearchDoc, SearchHit, SearchKind } from '../types';
import { matchDoc } from './match';

// How many results the spotlight shows. One number, one place.
export const SEARCH_LIMIT: number = 5;

interface SearchIndexArgs {
  index: SearchDoc[];
  query: string;
  // Kinds the results are narrowed to — the spotlight's pills. Empty means every kind.
  kinds?: SearchKind[];
  limit?: number;
}

// Every doc the query matches, best first, capped. An empty query matches nothing even with a
// filter on: the box is a prompt to type, not a list to dismiss.
export const searchIndex = ({
  index,
  query,
  kinds = [],
  limit = SEARCH_LIMIT
}: SearchIndexArgs): SearchHit[] => {
  const needle: string = query.trim().toLowerCase();
  if (needle.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const doc of index) {
    if (kinds.length > 0 && !kinds.includes(doc.kind)) continue;

    const hit: SearchHit | undefined = matchDoc({ doc, query: needle });
    if (hit) hits.push(hit);
  }

  return hits.sort(byScore).slice(0, limit);
};

// Score first, then the order the panel already lists things in.
const byScore = (left: SearchHit, right: SearchHit): number =>
  right.score - left.score || left.doc.rank - right.doc.rank;
