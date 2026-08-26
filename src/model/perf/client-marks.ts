import { orderPhases } from './report';
import { PerfPhaseReport, PerfReport, ReadTotals } from './types';

const NO_READS: ReadTotals = { files: 0, directories: 0, bytes: 0, ioMs: 0 };

export interface PerfClientMarks {
  // When the webview told the host it was listening — the end of the bundle's own boot.
  readyAt: number;
  // When the landing page first rendered.
  paintedAt: number;
}

interface WithClientMarksArgs {
  report: PerfReport;
  marks: PerfClientMarks;
}

// The webview's half of the timeline. Only it knows when its bundle booted and when the page went
// up, and only the host knows when the panel was created — so the two halves are put together here,
// which is the one place both numbers are in hand.
//
// `paint` overlaps the host's stages: it's the wait for the snapshot plus the render. That's why
// the bars are drawn against the longest stage rather than as shares of a total — overlapping spans
// have no honest share.
export const withClientMarks = ({ report, marks }: WithClientMarksArgs): PerfReport => {
  const client: PerfPhaseReport[] = [
    { phase: 'boot', ms: marks.readyAt - report.openedAt, depth: 0, ...NO_READS },
    { phase: 'paint', ms: marks.paintedAt - marks.readyAt, depth: 0, ...NO_READS }
  ];

  return {
    ...report,
    readyMs: marks.paintedAt - report.openedAt,
    phases: orderPhases([...report.phases, ...client])
  };
};
