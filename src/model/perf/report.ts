import {
  PERF_PHASES,
  PerfLog,
  PerfPhaseReport,
  PerfReport,
  ReadTotals
} from './types';

const NO_READS: ReadTotals = { files: 0, directories: 0, bytes: 0, ioMs: 0 };

interface BuildReportArgs {
  log: PerfLog;
  // When the panel was created. The headline is measured from here rather than summed from the
  // stages, which overlap.
  openedAt: number;
}

// The recorder's raw log as the thing the panel draws. Pure — the host hands it `perfLog()`, and a
// test hands it whatever shape it wants to ask about.
export const buildReport = ({ log, openedAt }: BuildReportArgs): PerfReport => {
  const phases: PerfPhaseReport[] = orderPhases(
    log.spans.map((span) => ({
      phase: span.phase,
      ms: span.ms,
      depth: span.depth,
      ...(log.totals.get(span.phase) ?? NO_READS)
    }))
  );

  // Depth-0 stages only. A read inside `skills` is counted in `snapshot` as well, and no two
  // top-level stages ever nest — so this is the total without double-counting.
  const top: PerfPhaseReport[] = phases.filter((phase) => phase.depth === 0);

  return {
    openedAt,
    phases,
    files: sumOf({ phases: top, field: 'files' }),
    directories: sumOf({ phases: top, field: 'directories' }),
    bytes: sumOf({ phases: top, field: 'bytes' }),
    ioMs: sumOf({ phases: top, field: 'ioMs' }),
    slowest: log.slowest,
    running: log.running
  };
};

// The order the stages actually happen in, which is the order `PERF_PHASES` is written in. Exported
// because the webview merges its own two marks into the same list.
export const orderPhases = (phases: PerfPhaseReport[]): PerfPhaseReport[] =>
  [...phases].sort(
    (one, other) => PERF_PHASES.indexOf(one.phase) - PERF_PHASES.indexOf(other.phase)
  );

interface SumOfArgs {
  phases: PerfPhaseReport[];
  field: keyof ReadTotals;
}

const sumOf = ({ phases, field }: SumOfArgs): number =>
  phases.reduce((total: number, phase: PerfPhaseReport) => total + phase[field], 0);
