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
    report.scanning ? '(the usage scan had not finished)' : undefined,
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
