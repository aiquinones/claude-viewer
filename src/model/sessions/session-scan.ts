// What a live session's whole log says, held so it's only ever read once. Two things are read this
// way and they have the same shape of problem: the skills a session loaded, and the deliverables it
// declared. Both sit all through a log rather than at an end of it — a skill load in Claude's 64KB
// tail in 6 of 13 transcripts measured here, none of three Copilot sessions, and a deliverable
// announced at minute two of a four-hour session is no easier to find.
//
// So this walks the whole file the first time and only the appended bytes after. One pass yields
// both: two features each opening the same log every 2s poll is the thing to avoid.

import { AppendedLines, readAppendedLines } from '../../config/read';
import { Deliverable } from '../types';
import { mergeDeliverables } from './deliverables';

// How many skills a row carries. Real sessions run to about ten distinct ones; the cap keeps a log
// nobody has closed in a week from growing the message without bound. The newest are the ones kept
// — the stage a row is in is at the end.
const TRAIL_LIMIT: number = 32;

// What one pass over a run of lines found. Each CLI's reader returns this, so a tool that reads one
// half and not the other says so by returning nothing for it rather than by having its own shape.
export interface ScanFindings {
  skills: string[];
  deliverables: Deliverable[];
}

export interface SessionScan extends ScanFindings {
  // Byte offset just past the last whole line read. What makes the next pass cost nothing.
  offset: number;
}

// Keyed by log path. Owned by the caller, the way `CopilotPrCache` is — nothing in `model/` holds
// state of its own.
export type SessionScanCache = Map<string, SessionScan>;

export const newSessionScanCache = (): SessionScanCache => new Map();

interface ReadSessionScanArgs {
  path: string;
  cache: SessionScanCache;
  // Whole lines → what they declared. Only ever handed the lines appended since the last pass, so
  // each CLI's reader has to be a function of its own lines alone.
  parse: (lines: readonly string[]) => ScanFindings;
}

// Everything the log has said so far, folded across every pass. A skill run is collapsed to one
// entry and a redeclared deliverable replaces the one it repeats.
export const readSessionScan = async ({
  path,
  cache,
  parse
}: ReadSessionScanArgs): Promise<ScanFindings> => {
  const held: SessionScan = cache.get(path) ?? { offset: 0, skills: [], deliverables: [] };

  const read: AppendedLines | undefined = await readAppendedLines({ path, offset: held.offset });

  if (!read) {
    cache.delete(path);
    return { skills: [], deliverables: [] };
  }

  // Shorter than the offset means the file was replaced rather than appended to, so what was read
  // out of the old one is about a log that no longer exists.
  const rewound: boolean = read.rewound;
  const found: ScanFindings = parse(read.lines);

  const skills: string[] = trimTrail([...(rewound ? [] : held.skills), ...found.skills]);
  const deliverables: Deliverable[] = mergeDeliverables(
    rewound ? [] : held.deliverables,
    found.deliverables
  );

  cache.set(path, { offset: read.offset, skills, deliverables });
  return { skills, deliverables };
};

// Drops the logs that aren't live any more, so the cache is bounded by what's running rather than
// by how long the panel has been open.
export const pruneSessionScans = (cache: SessionScanCache, paths: readonly string[]): void => {
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
