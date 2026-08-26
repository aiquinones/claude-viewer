// The skills a live session has loaded, in order. Which of them opens a *stage* is a setting, so
// nothing here knows about stages — the host records what the log says and the webview maps it.
//
// A tail read can't answer this. Claude's 64KB tail holds an invocation in 6 of 13 transcripts
// measured here, and Copilot's 256KB tail holds a `skill.invoked` in none of the three sessions
// that loaded one — its events inline the whole skill body, so they sit hundreds of KB back. So
// this walks the whole log, and holds an offset so it only ever walks it once.

import { AppendedLines, readAppendedLines } from '../../config/read';

// How many entries a row carries. Real sessions run to about ten distinct skills; the cap keeps a
// log nobody has closed in a week from growing the message without bound. The newest are the ones
// kept — the stage a row is in is at the end.
const TRAIL_LIMIT: number = 32;

export interface SkillTrailScan {
  // Byte offset just past the last whole line read. What makes the next pass cost nothing.
  offset: number;
  skills: string[];
}

// Keyed by log path. Owned by the caller, the way `CopilotPrCache` is — nothing in `model/` holds
// state of its own.
export type SkillTrailCache = Map<string, SkillTrailScan>;

export const newSkillTrailCache = (): SkillTrailCache => new Map();

interface ReadSkillTrailArgs {
  path: string;
  cache: SkillTrailCache;
  // Whole lines → the skills loaded on them, oldest first. Only ever handed the lines appended
  // since the last pass, so each CLI's reader has to be a function of its own lines alone.
  parse: (lines: readonly string[]) => string[];
}

// Every skill this session has loaded, oldest first, with a run of the same skill collapsed to one.
// A repeat is dropped for the reason `toStages` drops it: Copilot injects a skill because you typed
// its name and loads it again when the model asks for what it already has, five seconds apart.
export const readSkillTrail = async ({
  path,
  cache,
  parse
}: ReadSkillTrailArgs): Promise<string[]> => {
  const held: SkillTrailScan = cache.get(path) ?? { offset: 0, skills: [] };

  const read: AppendedLines | undefined = await readAppendedLines({ path, offset: held.offset });

  if (!read) {
    cache.delete(path);
    return [];
  }

  // Shorter than the offset means the file was replaced rather than appended to, so what was read
  // out of the old one is about a log that no longer exists.
  const before: string[] = read.rewound ? [] : held.skills;
  const skills: string[] = trimTrail([...before, ...parse(read.lines)]);

  cache.set(path, { offset: read.offset, skills });
  return skills;
};

// Drops the logs that aren't live any more, so the cache is bounded by what's running rather than
// by how long the panel has been open.
export const pruneSkillTrails = (cache: SkillTrailCache, paths: readonly string[]): void => {
  const live: Set<string> = new Set(paths);
  for (const path of cache.keys()) {
    if (!live.has(path)) cache.delete(path);
  }
};

// The run-collapse and the cap, in that order — collapsing first means a cap of 32 is 32 distinct
// stretches rather than 32 loads. What's held is already collapsed, so this only ever has the
// newly appended tail to fold in.
const trimTrail = (skills: readonly string[]): string[] => {
  const collapsed: string[] = [];

  for (const skill of skills) {
    if (collapsed[collapsed.length - 1] === skill) continue;
    collapsed.push(skill);
  }

  return collapsed.slice(-TRAIL_LIMIT);
};
