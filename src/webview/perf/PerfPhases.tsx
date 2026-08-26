import { PerfPhaseReport } from '../../model/perf/types';
import { formatMs } from './format-ms';
import { BAR_NOTE, PHASE_LABELS, PHASE_NOTES } from './perf-labels';

interface PerfPhasesProps {
  phases: PerfPhaseReport[];
  // The usage scan hasn't landed yet, so its row is missing rather than zero.
  scanning: boolean;
}

// The stages of the launch, longest bar first in magnitude rather than in order — the list itself
// stays in the order things happened, which is what makes a slow one findable.
export const PerfPhases = ({ phases, scanning }: PerfPhasesProps) => {
  const longest: number = Math.max(...phases.map((phase) => phase.ms), 1);

  return (
    <div className="flex flex-col gap-1">
      {phases.map((phase) => (
        <PhaseRow key={phase.phase} phase={phase} longest={longest} />
      ))}

      {scanning && (
        <div className="flex items-center gap-2 pl-1 pt-0.5 text-[11px] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
          Usage scan still running
        </div>
      )}

      <p className="pt-1 text-[11px] text-muted-foreground">{BAR_NOTE}</p>
    </div>
  );
};

interface PhaseRowProps {
  phase: PerfPhaseReport;
  longest: number;
}

const PhaseRow = ({ phase, longest }: PhaseRowProps) => (
  <div
    className="flex items-center gap-2 text-xs"
    // Indented rather than nested markup: a stage inside another is one step in, and the reads it
    // did are already counted in its parent's row.
    style={{ paddingLeft: `${phase.depth * 0.75}rem` }}
    title={PHASE_NOTES[phase.phase]}
  >
    <span className={`w-32 shrink-0 truncate ${phase.depth > 0 ? 'text-muted-foreground' : ''}`}>
      {PHASE_LABELS[phase.phase]}
    </span>

    <span className="h-1.5 min-w-0 flex-1 overflow-clip rounded-full bg-muted">
      <span
        className="block h-full rounded-full bg-primary"
        style={{ width: `${Math.max((phase.ms / longest) * 100, 2)}%` }}
      />
    </span>

    <span className="mono w-14 shrink-0 text-right tabular-nums">{formatMs(phase.ms)}</span>
  </div>
);
