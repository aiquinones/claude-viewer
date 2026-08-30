import { AsyncLocalStorage } from 'node:async_hooks';
import { PerfLog, PerfPhase, PerfRead, PerfReadKind, PerfSpan, ReadTotals } from './types';

// What the launch cost, collected while it happens. One recorder for the extension: a launch is a
// launch, and none of this is per-panel.
//
// Which stage a read belongs to goes through AsyncLocalStorage rather than a "current phase"
// variable. The snapshot stage runs three loaders concurrently and the polls overlap each
// other, so a variable would credit whichever of them ran last.
const openPhases: AsyncLocalStorage<PerfPhase[]> = new AsyncLocalStorage();

// How many of the slow ones the report can name. A usage scan opens every transcript on the
// machine, so this is a running top-N rather than a log of everything.
const SLOWEST_KEPT: number = 8;

const spans: PerfSpan[] = [];
// Stages that have been entered and haven't returned. What the report calls `running`, and the
// reason it can be built and posted before a launch is over.
const running: Set<PerfPhase> = new Set();
const totals: Map<PerfPhase, ReadTotals> = new Map();
// Stages that have already run once. A launch is the first time each one happens.
const finished: Set<PerfPhase> = new Set();
let slowest: PerfRead[] = [];

// Everything collected so far. `report.ts` does the arithmetic.
export const perfLog = (): PerfLog => ({ spans, totals, slowest, running: [...running] });

// Runs `load` as a named stage, and every read inside it — however deeply nested, however
// concurrent — is attributed here. A stage runs again on every poll, and the launch is the first
// time: later passes record nothing, neither a span nor the reads under them.
export const perfPhase = async <Value>(
  phase: PerfPhase,
  load: () => Promise<Value>
): Promise<Value> => {
  if (finished.has(phase)) return load();

  const open: PerfPhase[] = openPhases.getStore() ?? [];
  const startedAt: number = Date.now();
  const start: number = performance.now();
  running.add(phase);

  try {
    return await openPhases.run([...open, phase], load);
  } finally {
    running.delete(phase);
    finished.add(phase);
    spans.push({ phase, ms: performance.now() - start, depth: open.length, startedAt });
  }
};

interface PerfMarkArgs {
  phase: PerfPhase;
  ms: number;
}

// A stage measured somewhere `perfPhase` can't wrap — activation, which VS Code calls
// synchronously. No reads are attributed to it.
export const perfMark = ({ phase, ms }: PerfMarkArgs): void => {
  if (finished.has(phase)) return;
  finished.add(phase);
  spans.push({ phase, ms, depth: 0, startedAt: Date.now() - ms });
};

interface RecordReadArgs {
  path: string;
  kind: PerfReadKind;
  bytes: number;
  ms: number;
}

// One call into `config/read.ts`. Only reads inside a stage that's still open count: a body fetched
// because something was clicked, or the tenth pass of a poll, isn't what the launch cost.
export const recordRead = ({ path, kind, bytes, ms }: RecordReadArgs): void => {
  const open: PerfPhase[] | undefined = openPhases.getStore();
  if (!open?.length) return;

  const read: PerfRead = { path, kind, bytes, ms, phase: open[open.length - 1] };
  // Credited to every stage that's open, so a nested one counts in its parent as well — which is
  // also why the totals sum over depth-0 stages only and can't double-count.
  for (const phase of open) addRead({ phase, read });
  keepIfSlow(read);
};

interface AddReadArgs {
  phase: PerfPhase;
  read: PerfRead;
}

const addRead = ({ phase, read }: AddReadArgs): void => {
  const totalsFor: ReadTotals = totals.get(phase) ?? {
    files: 0,
    directories: 0,
    bytes: 0,
    ioMs: 0
  };

  if (read.kind === 'dir') totalsFor.directories += 1;
  else totalsFor.files += 1;
  totalsFor.bytes += read.bytes;
  totalsFor.ioMs += read.ms;

  totals.set(phase, totalsFor);
};

// Kept sorted worst-first, so the common case is one comparison against the tail.
const keepIfSlow = (read: PerfRead): void => {
  if (slowest.length === SLOWEST_KEPT && read.ms <= slowest[slowest.length - 1].ms) return;
  slowest = [...slowest, read].sort((one, other) => other.ms - one.ms).slice(0, SLOWEST_KEPT);
};
