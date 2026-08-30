import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PerfLog, PerfSpan, ReadTotals } from '@src/model/perf/types';

// The recorder is module state, which is what a launch is — so each test takes a fresh copy of the
// module rather than a reset the production code would otherwise have to carry.
type Recorder = typeof import('@src/model/perf/recorder');

let recorder: Recorder;

beforeEach(async () => {
  vi.resetModules();
  recorder = await import('@src/model/perf/recorder');
});

const totalsFor = (phase: 'skills' | 'memory' | 'snapshot' | 'agents'): ReadTotals => {
  const log: PerfLog = recorder.perfLog();
  return log.totals.get(phase) ?? { files: 0, directories: 0, bytes: 0, ioMs: 0 };
};

// A read that yields, so two stages running together really do interleave rather than each
// finishing before the other starts.
const readAfterTick = async (path: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1));
  recorder.recordRead({ path, kind: 'file', bytes: 100, ms: 1 });
};

describe('perfLog().running', () => {
  it('names the stages that have been entered and have not returned', async () => {
    // What the perf card draws a "still running" line from. A stage in flight has pushed no span,
    // so the rows the card already has can't tell a slow stage from one that never ran.
    let insideSkills: string[] = [];
    let insideBoth: string[] = [];

    await recorder.perfPhase('snapshot', async () => {
      await recorder.perfPhase('skills', async () => {
        insideBoth = recorder.perfLog().running;
      });
      insideSkills = recorder.perfLog().running;
    });

    expect(insideBoth).toEqual(['snapshot', 'skills']);
    // `skills` has returned by here, so it's a span rather than a running stage.
    expect(insideSkills).toEqual(['snapshot']);
    expect(recorder.perfLog().running).toEqual([]);
  });

  it('clears a stage that threw, so a failed read is not reported as still running forever', async () => {
    await expect(
      recorder.perfPhase('memory', () => Promise.reject(new Error('gone')))
    ).rejects.toThrow('gone');

    expect(recorder.perfLog().running).toEqual([]);
  });
});

describe('perfPhase', () => {
  it('credits concurrent stages separately', async () => {
    // The reason attribution goes through AsyncLocalStorage: the snapshot stage runs its loaders
    // concurrently, so a "current phase" variable would give both stages' reads to whichever one
    // happened to touch it last.
    await Promise.all([
      recorder.perfPhase('skills', async () => {
        await readAfterTick('/skills/one.md');
        await readAfterTick('/skills/two.md');
      }),
      recorder.perfPhase('memory', () => readAfterTick('/memory/one.md'))
    ]);

    expect(totalsFor('skills').files).toBe(2);
    expect(totalsFor('memory').files).toBe(1);
  });

  it('credits a nested stage to its parent as well', async () => {
    await recorder.perfPhase('snapshot', () =>
      recorder.perfPhase('skills', () => readAfterTick('/skills/one.md'))
    );

    expect(totalsFor('skills').files).toBe(1);
    expect(totalsFor('snapshot').files).toBe(1);
  });

  it('records the first run of a stage and nothing after it', async () => {
    // Every stage here is also a poll. A report that kept the latest pass would stop being about
    // the launch a few seconds after the panel opened.
    await recorder.perfPhase('agents', () => readAfterTick('/agents/one.json'));
    await recorder.perfPhase('agents', () => readAfterTick('/agents/two.json'));

    expect(recorder.perfLog().spans.filter((span) => span.phase === 'agents')).toHaveLength(1);
    expect(totalsFor('agents').files).toBe(1);
  });

  it('closes a stage that threw, and lets the error through', async () => {
    await expect(
      recorder.perfPhase('skills', () => Promise.reject(new Error('unreadable')))
    ).rejects.toThrow('unreadable');

    expect(recorder.perfLog().spans.map((span) => span.phase)).toEqual(['skills']);
  });

  it('ignores a read that no stage is open for', async () => {
    // A file body fetched because something was clicked isn't what the launch cost.
    recorder.recordRead({ path: '/clicked.md', kind: 'file', bytes: 10, ms: 1 });

    expect(recorder.perfLog().slowest).toEqual([]);
    expect(recorder.perfLog().totals.size).toBe(0);
  });

  it('keeps the slowest reads, worst first, and drops the rest', async () => {
    await recorder.perfPhase('skills', async () => {
      for (const ms of [5, 90, 1, 40, 3, 2, 60, 7, 8, 9, 10]) {
        recorder.recordRead({ path: `/read-${ms}.md`, kind: 'file', bytes: 1, ms });
      }
    });

    const slowest: number[] = recorder.perfLog().slowest.map((read) => read.ms);

    expect(slowest).toHaveLength(8);
    expect(slowest[0]).toBe(90);
    expect([...slowest].sort((one, other) => other - one)).toEqual(slowest);
    expect(slowest).not.toContain(1);
  });
});

describe('perfMark', () => {
  it('records a stage measured somewhere perfPhase cannot wrap', () => {
    recorder.perfMark({ phase: 'activate', ms: 12 });
    recorder.perfMark({ phase: 'activate', ms: 99 });

    const spans: PerfSpan[] = recorder.perfLog().spans;
    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatchObject({ phase: 'activate', ms: 12, depth: 0 });
  });
});
