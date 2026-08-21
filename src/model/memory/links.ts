import { MemoryLink } from '../types';

// `[[name]]`, which is how the memory instructions say to link one memory to another. Unlike a
// skill mention there's no ambiguity to guard against: the brackets are the marker, so nothing has
// to reason about whether a bare word was meant as a name.
const WIKI_LINK = /\[\[([^\]\n]+)\]\]/g;

// The links in one memory's body, deduped and in the order they appear. `names` is every memory
// that exists, which is what decides whether a link resolves — an unresolved one is normal and
// marks something worth writing later, so it comes back as a link either way.
export const findMemoryLinks = (text: string, names: Set<string>): MemoryLink[] => {
  const seen: Set<string> = new Set();
  const links: MemoryLink[] = [];

  for (const match of text.matchAll(WIKI_LINK)) {
    const name: string = match[1].trim();
    if (name === '' || seen.has(name)) continue;

    seen.add(name);
    links.push({ name, resolved: names.has(name) });
  }

  return links;
};
