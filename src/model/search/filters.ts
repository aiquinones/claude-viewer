import { SEARCH_KINDS, SearchKind } from '../types';

// The word that turns typed text into a pill, GitHub-style: `filter:skill`.
export const FILTER_PREFIX: string = 'filter:';

// A `filter:<kind>` sitting at the end of the box. Anchored to the end so it fires the moment the
// kind name is complete, which is what makes the text disappear into a pill as you type.
const FILTER_TOKEN: RegExp = /(^|\s)filter:([\w-]+)$/i;

export interface FilterToken {
  kind: SearchKind;
  // What's left of the query once the token is lifted out of it.
  rest: string;
}

// Undefined means nothing to lift — either there's no token, or what follows `filter:` isn't a
// kind yet. The caller leaves the box alone in both cases.
export const takeFilterToken = (query: string): FilterToken | undefined => {
  const match: RegExpExecArray | null = FILTER_TOKEN.exec(query);
  if (!match) return undefined;

  const typed: string = match[2].toLowerCase();
  const kind: SearchKind | undefined = SEARCH_KINDS.find((known) => known === typed);
  if (!kind) return undefined;

  return { kind, rest: query.slice(0, match.index).trim() };
};
