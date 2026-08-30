import { ConfigSnapshot, SnapshotPart } from '../model/types';

// The three parts of the config land separately, so a surface that has nothing in it and one whose
// loader is still out look identical unless something asks. Four places ask — the landing card and
// the body of each surface — which is why the question lives here rather than in any of them.

interface IsPendingArgs {
  snapshot: ConfigSnapshot;
  part: SnapshotPart;
}

export const isPending = ({ snapshot, part }: IsPendingArgs): boolean =>
  snapshot.pending.includes(part);

// What a landing card says while its loader is out. One string, so the three of them can't drift.
export const READING_DETAIL: string = 'Reading config…';

// What the bar under a waiting surface guesses at. Longer than a file read: skills opens every
// SKILL.md on the machine and the system prompt walks the workspace, which on a big repo is
// seconds — past this the bar stops guessing and goes indeterminate.
export const CONFIG_EXPECTED_MS: number = 1500;
