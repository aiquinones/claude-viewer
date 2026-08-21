import { MemoryEntry, MemoryIndex, MemoryIndexEntry, MemorySet } from '@src/model/types';

// Synthetic only, like every other fixture here — auto-memory is the one config surface made
// entirely of things written about the person using it, so a real one has no business in the repo.
const MEMORY_DIR: string = '/Users/dev/.claude/projects/-Users-dev-repos-example-app/memory';

// Ages are relative to this, and the view ages them against `snapshot.loadedAt`. Both are fixed, so
// a story's ages don't drift between runs the way the agents fixtures deliberately do.
const NOW: number = Date.UTC(2026, 7, 1);

const HOUR: number = 60 * 60 * 1000;
const DAY: number = 24 * HOUR;

interface MakeMemoryArgs extends Partial<MemoryEntry> {
  name: string;
}

// `chars` drives the token estimate the way the loader does it, so a fixture can't quote a cost its
// own text disagrees with.
const makeMemory = ({ name, ...overrides }: MakeMemoryArgs): MemoryEntry => {
  const chars: number = overrides.chars ?? 1180;

  return {
    name,
    description: 'Something worth remembering between sessions.',
    type: 'feedback',
    path: `${MEMORY_DIR}/${name}.md`,
    chars,
    modifiedAt: NOW - 2 * DAY,
    links: [],
    indexed: true,
    issues: [],
    ...overrides
  };
};

export const feedbackMemory: MemoryEntry = makeMemory({
  name: 'run-migrations-before-the-suite',
  description: 'The tests assume a migrated database — run the migration step first or all of them fail.',
  modifiedAt: NOW - 2 * DAY,
  links: [{ name: 'seed-the-test-database', resolved: true }]
});

export const linkedMemory: MemoryEntry = makeMemory({
  name: 'seed-the-test-database',
  description: 'Fixtures come from the seed script, never from a snapshot of the dev database.',
  modifiedAt: NOW - 26 * HOUR,
  chars: 940,
  // A link to a memory nobody has written yet. Not a failure — it marks one worth writing.
  links: [{ name: 'reset-between-test-runs', resolved: false }]
});

export const userMemory: MemoryEntry = makeMemory({
  name: 'prefers-small-pull-requests',
  description: 'Splits work into a few hundred lines per PR, and asks reviewers to say when one grows.',
  type: 'user',
  modifiedAt: NOW - 9 * DAY,
  chars: 1320
});

export const projectMemory: MemoryEntry = makeMemory({
  name: 'checkout-flow-is-flagged',
  description: 'The new checkout sits behind a flag; both paths have to keep working until it lands.',
  type: 'project',
  modifiedAt: NOW - 4 * HOUR,
  chars: 760
});

export const referenceMemory: MemoryEntry = makeMemory({
  name: 'payment-provider-contract',
  description: 'Where the provider’s API contract lives, and which edge cases it settles.',
  type: 'reference',
  modifiedAt: NOW - 12 * DAY,
  chars: 420
});

// The first failure mode: on disk, and no line in MEMORY.md points at it.
export const unindexedMemory: MemoryEntry = makeMemory({
  name: 'reads-logs-as-json',
  description: 'Wants log output as JSON so it pipes into jq without reformatting.',
  type: 'user',
  modifiedAt: NOW - 5 * HOUR,
  chars: 610,
  indexed: false,
  issues: [
    { severity: 'warning', message: 'no line in MEMORY.md — written, but no session will recall it' }
  ]
});

// A file whose metadata says something the loader doesn't know. It still renders, in its own group.
export const untypedMemory: MemoryEntry = makeMemory({
  name: 'half-written-note',
  description: '',
  type: undefined,
  declaredType: 'preference',
  modifiedAt: NOW - 40 * DAY,
  chars: 210,
  issues: [
    {
      severity: 'warning',
      message: 'metadata.type is "preference", which is not one of user, feedback, project, reference'
    },
    { severity: 'warning', message: 'no description — recall has nothing to match against' }
  ]
});

export const allMemories: MemoryEntry[] = [
  userMemory,
  unindexedMemory,
  feedbackMemory,
  linkedMemory,
  projectMemory,
  referenceMemory,
  untypedMemory
];

const indexEntry = (memory: MemoryEntry, hook: string): MemoryIndexEntry => ({
  title: memory.name,
  target: `${memory.name}.md`,
  hook,
  path: memory.path
});

// The index as it usually is: one line per memory that any session will actually read.
export const memoryIndex: MemoryIndex = {
  path: `${MEMORY_DIR}/MEMORY.md`,
  present: true,
  chars: 690,
  entries: [
    indexEntry(userMemory, 'keeps pull requests small'),
    indexEntry(feedbackMemory, 'migrate before running the suite'),
    indexEntry(linkedMemory, 'seed data comes from the script'),
    indexEntry(projectMemory, 'the checkout flag'),
    indexEntry(referenceMemory, 'the payment contract'),
    indexEntry(untypedMemory, 'unfinished')
  ],
  issues: []
};

// The second failure mode: a line that still spends tokens claiming a memory that isn't there.
export const memoryIndexWithDangling: MemoryIndex = {
  ...memoryIndex,
  entries: [
    ...memoryIndex.entries,
    { title: 'deleted-convention', target: 'deleted-convention.md', hook: 'gone', path: undefined }
  ],
  issues: [
    {
      severity: 'warning',
      message: '1 entry points at a file that is not there — it costs tokens and recalls nothing'
    }
  ]
};

export const emptyMemoryIndex: MemoryIndex = {
  path: `${MEMORY_DIR}/MEMORY.md`,
  present: false,
  chars: 0,
  entries: [],
  issues: []
};

export const memorySet: MemorySet = {
  dir: MEMORY_DIR,
  index: memoryIndex,
  memories: allMemories
};

export const brokenMemorySet: MemorySet = {
  dir: MEMORY_DIR,
  index: memoryIndexWithDangling,
  memories: allMemories
};

// A directory that exists and holds nothing — the state right after a workspace is first opened.
export const emptyMemorySet: MemorySet = {
  dir: MEMORY_DIR,
  index: emptyMemoryIndex,
  memories: []
};
