import { describe, expect, it } from 'vitest';
import { withClientMarks } from '@src/model/perf/client-marks';
import { buildReport, orderPhases } from '@src/model/perf/report';
import {
  PerfLog,
  PerfPhase,
  PerfPhaseReport,
  PerfRead,
  PerfReport,
  PerfSpan,
  ReadTotals
} from '@src/model/perf/types';

interface SpanArgs {
  phase: PerfPhase;
  ms: number;
  depth?: number;
}

const span = ({ phase, ms, depth = 0 }: SpanArgs): PerfSpan => ({
  phase,
  ms,
  depth,
  startedAt: 1_000
});

interface TotalsArgs {
  files?: number;
  directories?: number;
  bytes?: number;
  ioMs?: number;
}

const totals = ({ files = 0, directories = 0, bytes = 0, ioMs = 0 }: TotalsArgs): ReadTotals => ({
  files,
  directories,
  bytes,
  ioMs
});

const read = (path: string, ms: number): PerfRead => ({
  path,
  kind: 'file',
  bytes: 10,
  ms,
  phase: 'skills'
});

const emptyLog: PerfLog = { spans: [], totals: new Map(), slowest: [], running: [] };

describe('buildReport', () => {
  it('sums the top-level stages only, so a nested one is not counted twice', () => {
    // `skills` runs inside `snapshot`, and a read is credited to every stage that was open — so
    // summing both rows would report every SKILL.md as having been opened twice.
    const log: PerfLog = {
      spans: [span({ phase: 'snapshot', ms: 30 }), span({ phase: 'skills', ms: 20, depth: 1 })],
      totals: new Map([
        ['snapshot', totals({ files: 40, bytes: 4_000, ioMs: 25 })],
        ['skills', totals({ files: 38, bytes: 3_800, ioMs: 22 })]
      ]),
      slowest: [],
      running: []
    };

    const report: PerfReport = buildReport({ log, openedAt: 500 });

    expect(report.files).toBe(40);
    expect(report.bytes).toBe(4_000);
    expect(report.ioMs).toBe(25);
  });

  it('counts two top-level stages together', () => {
    const log: PerfLog = {
      spans: [span({ phase: 'snapshot', ms: 30 }), span({ phase: 'agents', ms: 12 })],
      totals: new Map([
        ['snapshot', totals({ files: 40, directories: 6, bytes: 400 })],
        ['agents', totals({ files: 3, directories: 2, bytes: 60 })]
      ]),
      slowest: [],
      running: []
    };

    const report: PerfReport = buildReport({ log, openedAt: 0 });

    expect(report.files).toBe(43);
    expect(report.directories).toBe(8);
    expect(report.bytes).toBe(460);
  });

  it('carries the stages that had not landed', () => {
    // Every part of the config and the usage scan start un-awaited, so the first report of a launch
    // normally names several. A stage that's running has no span yet, which is why the card can't
    // work this out from the rows it draws.
    const mid: PerfReport = buildReport({
      log: {
        ...emptyLog,
        spans: [span({ phase: 'activate', ms: 8 })],
        running: ['snapshot', 'skills', 'usage']
      },
      openedAt: 0
    });
    expect(mid.running).toEqual(['snapshot', 'skills', 'usage']);

    const done: PerfReport = buildReport({
      log: {
        ...emptyLog,
        spans: [span({ phase: 'snapshot', ms: 30 }), span({ phase: 'usage', ms: 900 })]
      },
      openedAt: 0
    });
    expect(done.running).toEqual([]);
  });

  it('gives a stage with no reads a row of zeros rather than dropping it', () => {
    const report: PerfReport = buildReport({
      log: { ...emptyLog, spans: [span({ phase: 'activate', ms: 8 })] },
      openedAt: 0
    });

    expect(report.phases).toHaveLength(1);
    expect(report.phases[0]).toMatchObject({ phase: 'activate', ms: 8, files: 0, bytes: 0 });
  });

  it('has no ready time until the webview merges its marks in', () => {
    expect(buildReport({ log: emptyLog, openedAt: 100 }).readyMs).toBeUndefined();
  });

  it('carries the slowest reads through untouched', () => {
    const slowest: PerfRead[] = [read('/a.jsonl', 90), read('/b.md', 4)];
    expect(buildReport({ log: { ...emptyLog, slowest }, openedAt: 0 }).slowest).toEqual(slowest);
  });
});

describe('orderPhases', () => {
  it('puts the stages in the order they happen, not the order they finished', () => {
    // The three under the config read run concurrently, so which lands first is a race — and a
    // report that reordered itself between two launches would read as the stages having moved.
    const phases: PerfPhaseReport[] = [
      { phase: 'memory', ms: 2, depth: 1, ...totals({}) },
      { phase: 'usage', ms: 900, depth: 0, ...totals({}) },
      { phase: 'skills', ms: 20, depth: 1, ...totals({}) },
      { phase: 'activate', ms: 8, depth: 0, ...totals({}) },
      { phase: 'snapshot', ms: 30, depth: 0, ...totals({}) }
    ];

    expect(orderPhases(phases).map((phase) => phase.phase)).toEqual([
      'activate',
      'snapshot',
      'skills',
      'memory',
      'usage'
    ]);
  });
});

describe('withClientMarks', () => {
  const hostReport: PerfReport = buildReport({
    log: { ...emptyLog, spans: [span({ phase: 'snapshot', ms: 30 })] },
    openedAt: 1_000
  });

  const merged: PerfReport = withClientMarks({
    report: hostReport,
    marks: { readyAt: 1_090, paintedAt: 1_140 }
  });

  it('measures ready from the panel opening to the page being drawn', () => {
    // Not the sum of the stages: boot overlaps nothing, but paint contains the host's own read.
    expect(merged.readyMs).toBe(140);
  });

  it('adds the two stages only the webview can measure, in place', () => {
    expect(merged.phases.map((phase) => phase.phase)).toEqual(['boot', 'snapshot', 'paint']);
    expect(merged.phases[0].ms).toBe(90);
    expect(merged.phases[2].ms).toBe(50);
  });

  it('leaves the read totals alone — the webview opened nothing', () => {
    expect(merged.files).toBe(hostReport.files);
    expect(merged.phases.find((phase) => phase.phase === 'boot')?.files).toBe(0);
  });
});
