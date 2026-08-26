import { useState } from 'react';
import { PerfRead, PerfReport } from '../../model/perf/types';
import { displayDirectory, fileName } from '../display-path';
import { CollapsibleHeading } from '../CollapsibleHeading';
import { formatBytes, plural } from '../format-size';
import { formatMs } from './format-ms';
import { READ_KIND_LABELS } from './perf-labels';

interface PerfReadsProps {
  report: PerfReport;
  workspaceRoot: string | undefined;
}

// What the launch actually opened, and which of those took the longest. The second half is the
// point: a total says the launch was slow, a named file says what to go and look at.
export const PerfReads = ({ report, workspaceRoot }: PerfReadsProps) => {
  const [slowestOpen, setSlowestOpen] = useState<boolean>(false);

  return (
  <div className="flex flex-col gap-2">
    <p className="text-xs text-muted-foreground">
      <span className="text-foreground">{plural(report.files, 'file')}</span> and{' '}
      <span className="text-foreground">
        {plural(report.directories, 'directory', 'directories')}
      </span>{' '}
      opened · <span className="text-foreground">{formatBytes(report.bytes)}</span> read ·{' '}
      <span className="text-foreground">{formatMs(report.ioMs)}</span> of it waiting on disk
    </p>

    {report.slowest.length > 0 && (
      <div className="flex flex-col gap-1">
        <CollapsibleHeading
          title="Slowest reads"
          collapsed={!slowestOpen}
          onToggle={() => setSlowestOpen(!slowestOpen)}
        />
        {slowestOpen &&
          report.slowest.map((read) => (
            <SlowRead key={`${read.path}-${read.ms}`} read={read} workspaceRoot={workspaceRoot} />
          ))}
      </div>
    )}
  </div>
  );
};

interface SlowReadProps {
  read: PerfRead;
  workspaceRoot: string | undefined;
}

const SlowRead = ({ read, workspaceRoot }: SlowReadProps) => (
  <div className="flex items-baseline gap-2 text-xs" title={read.path}>
    <span className="mono min-w-0 flex-1 truncate">
      {fileName(read.path)}
      <span className="pl-1.5 text-muted-foreground">
        {displayDirectory({ path: read.path, workspaceRoot })}
      </span>
    </span>
    <span className="shrink-0 text-[11px] text-muted-foreground">
      {READ_KIND_LABELS[read.kind]}
      {read.bytes > 0 && ` · ${formatBytes(read.bytes)}`}
    </span>
    <span className="mono w-14 shrink-0 text-right tabular-nums">{formatMs(read.ms)}</span>
  </div>
);
