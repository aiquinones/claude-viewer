// What a launch cost, measured while it happened. The host records it, the webview only reads it —
// so everything here has to survive `postMessage`: numbers and arrays, no maps.

// The stages of a launch, in the order the report draws them. Deliberately not annotated: PerfPhase
// derives from these literals, and a stage with no entry here has nothing to label it with.
export const PERF_PHASES = [
  'activate',
  'boot',
  'snapshot',
  'skills',
  'system-prompt',
  'memory',
  'agents',
  'paint',
  'usage'
] as const;

export type PerfPhase = (typeof PERF_PHASES)[number];

// What one call into `config/read.ts` did. `dir` is a listing or a stat — a look at the filesystem
// that hands back no bytes — and `db` is the one read that isn't a file at all: Copilot's context
// sizes live in a sqlite database.
export type PerfReadKind = 'file' | 'dir' | 'db';

export interface PerfRead {
  path: string;
  kind: PerfReadKind;
  bytes: number;
  ms: number;
  // The innermost stage that was open when it started.
  phase: PerfPhase;
}

// What the reads inside one stage came to. Counted per stage rather than logged, since a usage scan
// opens every transcript on the machine and the report never names more than a handful.
export interface ReadTotals {
  files: number;
  directories: number;
  bytes: number;
  ioMs: number;
}

export interface PerfSpan {
  phase: PerfPhase;
  ms: number;
  // How many stages were already open when this one started, so the report can indent a stage that
  // ran inside another.
  depth: number;
  startedAt: number;
}

// Everything the recorder collected, before any arithmetic. Lives here rather than in
// `recorder.ts` so `report.ts` can name it without importing the half that reaches for
// `node:async_hooks` — the webview bundles the report and would take the recorder with it.
export interface PerfLog {
  spans: PerfSpan[];
  totals: Map<PerfPhase, ReadTotals>;
  slowest: PerfRead[];
}

// One stage: how long it ran, and what the reads inside it cost.
export interface PerfPhaseReport extends ReadTotals {
  phase: PerfPhase;
  ms: number;
  depth: number;
}

export interface PerfReport {
  // When the panel was created. The webview measures its own half against this — it's the only
  // clock both processes share.
  openedAt: number;
  // Panel open → the landing page on screen. Undefined until the webview merges its own marks in:
  // only it knows when the page went up.
  readyMs?: number;
  phases: PerfPhaseReport[];
  files: number;
  directories: number;
  bytes: number;
  ioMs: number;
  // The slowest reads of the launch, worst first. Where a slow start is worth looking.
  slowest: PerfRead[];
  // The usage scan starts un-awaited and lands seconds after the page is up, so a report posted
  // before it finishes is complete apart from that one row.
  scanning: boolean;
}
