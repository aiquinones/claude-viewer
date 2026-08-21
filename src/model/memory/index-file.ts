import { MemoryIndexEntry } from '../types';

// One line of MEMORY.md: `- [Title](file.md) — hook`. The hook is optional and the dash it hangs
// off is written as an em dash, a hyphen or nothing at all, so it's taken as "whatever follows the
// link" rather than matched exactly.
const ENTRY = /^\s*[-*]\s*\[([^\]]*)\]\(([^)]+)\)\s*(.*)$/;

// The punctuation between the link and its hook, dropped so the hook reads as a sentence.
const LEADING_DASH = /^[\s—–-]+/;

// MEMORY.md → its entries. Pure: resolving a target to a file on disk is the loader's job, and
// this never touches one.
//
// A line that isn't an entry is skipped rather than flagged — the index is markdown, and a heading
// or a stray note above the list is normal.
export const parseMemoryIndex = (text: string): MemoryIndexEntry[] => {
  const entries: MemoryIndexEntry[] = [];

  for (const line of text.split(/\r?\n/)) {
    const match: RegExpExecArray | null = ENTRY.exec(line);
    if (!match) continue;

    const hook: string = match[3].replace(LEADING_DASH, '').trim();

    entries.push({
      title: match[1].trim(),
      target: match[2].trim(),
      hook: hook === '' ? undefined : hook
    });
  }

  return entries;
};
