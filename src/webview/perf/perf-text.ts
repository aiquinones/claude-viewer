import { PerfReport } from '../../model/perf/types';
import { formatBytes } from '../format-size';
import { formatMs } from './format-ms';
import { PHASE_LABELS, READ_KIND_LABELS } from './perf-labels';

// The card as plain text, for pasting into an issue. Same numbers in the same order — a launch
// worth reporting is one a screenshot doesn't help with.
export const perfReportText = (report: PerfReport): string => {
  const phases: string[] = report.phases.map(
    (phase) =>
      `${'  '.repeat(phase.depth)}${PHASE_LABELS[phase.phase]}: ${formatMs(phase.ms)}` +
      (phase.files > 0 ? ` (${phase.files} files, ${formatBytes(phase.bytes)})` : '')
  );

  const slowest: string[] = report.slowest.map(
    (read) => `  ${formatMs(read.ms)}  ${READ_KIND_LABELS[read.kind]}  ${read.path}`
  );

  const lines: (string | undefined)[] = [
    `Claude Viewer launch — ready in ${report.readyMs === undefined ? '?' : formatMs(report.readyMs)}`,
    stillRunning(report),
    '',
    ...phases,
    '',
    `${report.files} files, ${report.directories} directories, ${formatBytes(report.bytes)} read, ${formatMs(report.ioMs)} on disk`,
    '',
    'Slowest reads:',
    ...slowest
  ];

  return lines.filter((line): line is string => line !== undefined).join('\n');
};

// The stages that hadn't landed when this was copied. Worth carrying into an issue: a missing row
// and a stage that took no time look the same in the list above.
const stillRunning = (report: PerfReport): string | undefined => {
  if (report.running.length === 0) return undefined;

  const names: string = report.running.map((phase) => PHASE_LABELS[phase]).join(', ');
  return `(still running: ${names})`;
};
