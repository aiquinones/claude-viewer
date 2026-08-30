import { PerfPhaseReport, PerfRead, PerfReport } from '@src/model/perf/types';

// Synthetic launches. Real ones are read off this machine's own `~/.claude`, which never lands
// here — the paths below are made up, the shapes are what the recorder actually produces.

const OPENED_AT: number = 1_770_000_000_000;

interface PhaseArgs {
  phase: PerfPhaseReport['phase'];
  ms: number;
  depth?: number;
  files?: number;
  directories?: number;
  bytes?: number;
  ioMs?: number;
}

const phase = ({
  phase: name,
  ms,
  depth = 0,
  files = 0,
  directories = 0,
  bytes = 0,
  ioMs = 0
}: PhaseArgs): PerfPhaseReport => ({ phase: name, ms, depth, files, directories, bytes, ioMs });

interface ReadArgs {
  path: string;
  ms: number;
  bytes: number;
  kind?: PerfRead['kind'];
}

const read = ({ path, ms, bytes, kind = 'file' }: ReadArgs): PerfRead => ({
  path,
  ms,
  bytes,
  kind,
  phase: 'usage'
});

// A launch on a small workspace: everything under a fifth of a second, nothing worth looking at.
export const fastLaunch: PerfReport = {
  openedAt: OPENED_AT,
  running: [],
  phases: [
    phase({ phase: 'activate', ms: 11 }),
    phase({ phase: 'snapshot', ms: 42, files: 47, directories: 22, bytes: 486_000, ioMs: 31 }),
    phase({
      phase: 'skills',
      ms: 38,
      depth: 1,
      files: 38,
      directories: 9,
      bytes: 402_000,
      ioMs: 26
    }),
    phase({
      phase: 'system-prompt',
      ms: 24,
      depth: 1,
      files: 6,
      directories: 12,
      bytes: 74_000,
      ioMs: 4
    }),
    phase({ phase: 'memory', ms: 6, depth: 1, files: 3, directories: 1, bytes: 10_000, ioMs: 1 }),
    phase({ phase: 'agents', ms: 19, files: 8, directories: 4, bytes: 512_000, ioMs: 16 }),
    phase({ phase: 'usage', ms: 1_430, files: 112, directories: 9, bytes: 41_900_000, ioMs: 1_290 })
  ],
  files: 167,
  directories: 35,
  bytes: 42_898_000,
  ioMs: 1_337,
  slowest: [
    read({ path: '/Users/dev/.claude/projects/-Users-dev-repos-app/9e759067.jsonl', ms: 84, bytes: 8_400_000 }),
    read({ path: '/Users/dev/.claude/projects/-Users-dev-repos-app/1a2b3c4d.jsonl', ms: 61, bytes: 5_100_000 }),
    read({ path: '/Users/dev/.copilot/session-store.db', ms: 19, bytes: 0, kind: 'db' }),
    read({ path: '/Users/dev/repos/claude-viewer/CLAUDE.md', ms: 7, bytes: 41_000 }),
    read({ path: '/Users/dev/.claude/skills/dev-feature/SKILL.md', ms: 3, bytes: 3_800 })
  ]
};

// The one worth having a card for: a workspace walk that opened 900 directories looking for nested
// CLAUDE.md files, and a transcript big enough to see on its own.
export const slowLaunch: PerfReport = {
  ...fastLaunch,
  phases: [
    phase({ phase: 'activate', ms: 34 }),
    phase({ phase: 'snapshot', ms: 2_910, files: 61, directories: 941, bytes: 690_000, ioMs: 2_740 }),
    phase({
      phase: 'skills',
      ms: 44,
      depth: 1,
      files: 38,
      directories: 9,
      bytes: 402_000,
      ioMs: 29
    }),
    phase({
      phase: 'system-prompt',
      ms: 2_880,
      depth: 1,
      files: 20,
      directories: 931,
      bytes: 278_000,
      ioMs: 2_710
    }),
    phase({ phase: 'memory', ms: 9, depth: 1, files: 3, directories: 1, bytes: 10_000, ioMs: 2 }),
    phase({ phase: 'agents', ms: 26, files: 8, directories: 4, bytes: 512_000, ioMs: 21 }),
    phase({ phase: 'usage', ms: 4_100, files: 260, directories: 14, bytes: 92_000_000, ioMs: 3_880 })
  ],
  files: 329,
  directories: 959,
  bytes: 93_202_000,
  ioMs: 6_641,
  slowest: [
    read({ path: '/Users/dev/repos/monorepo/node_modules', ms: 412, bytes: 0, kind: 'dir' }),
    read({ path: '/Users/dev/.claude/projects/-Users-dev-repos-monorepo/aa11bb22.jsonl', ms: 221, bytes: 24_000_000 }),
    read({ path: '/Users/dev/repos/monorepo/packages', ms: 96, bytes: 0, kind: 'dir' }),
    read({ path: '/Users/dev/.copilot/session-store.db', ms: 44, bytes: 0, kind: 'db' }),
    read({ path: '/Users/dev/repos/monorepo/apps/web/CLAUDE.md', ms: 12, bytes: 22_000 })
  ]
};
