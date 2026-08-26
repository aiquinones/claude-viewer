import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { PerfPhaseReport } from '../../model/perf/types';
import { formatMs } from './format-ms';
import { PHASE_LABELS, PHASE_NOTES } from './perf-labels';

interface PerfPhasesProps {
  phases: PerfPhaseReport[];
  // The usage scan hasn't landed yet, so its row is missing rather than zero.
  scanning: boolean;
}

// The stages of the launch, longest bar first in magnitude rather than in order — the list itself
// stays in the order things happened, which is what makes a slow one findable.
export const PerfPhases = ({ phases, scanning }: PerfPhasesProps) => {
  const [configReadOpen, setConfigReadOpen] = useState<boolean>(false);
  const longest: number = Math.max(...phases.map((phase) => phase.ms), 1);

  return (
    <div className="flex flex-col gap-2">
      {phases.map((phase) => {
        const isConfigChild: boolean = phase.depth > 0;
        if (isConfigChild && !configReadOpen) return null;

        return (
          <PhaseRow
            key={phase.phase}
            phase={phase}
            longest={longest}
            collapsible={phase.phase === 'snapshot'}
            collapsed={phase.phase === 'snapshot' && !configReadOpen}
            onToggle={phase.phase === 'snapshot' ? () => setConfigReadOpen(!configReadOpen) : undefined}
          />
        );
      })}

      {scanning && (
        <div className="flex items-center gap-2 pl-1 pt-0.5 text-[11px] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
          Usage scan still running
        </div>
      )}
    </div>
  );
};

interface PhaseRowProps {
  phase: PerfPhaseReport;
  longest: number;
  collapsible: boolean;
  collapsed: boolean;
  onToggle: (() => void) | undefined;
}

const PhaseRow = ({ phase, longest, collapsible, collapsed, onToggle }: PhaseRowProps) => (
  <div
    className="flex items-center gap-2 py-0.5 text-xs"
    // Indented rather than nested markup: a stage inside another is one step in, and the reads it
    // did are already counted in its parent's row.
    style={{ paddingLeft: `${phase.depth * 0.75}rem` }}
    title={PHASE_NOTES[phase.phase]}
  >
    {collapsible ? (
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand config read' : 'Collapse config read'}
        onClick={onToggle}
        className="flex w-32 shrink-0 items-center gap-1 truncate text-left focus-visible:ring-1 focus-visible:ring-ring"
      >
        {collapsed ? (
          <ChevronRight className="size-3.5 shrink-0" />
        ) : (
          <ChevronDown className="size-3.5 shrink-0" />
        )}
        <span className="truncate">{PHASE_LABELS[phase.phase]}</span>
      </button>
    ) : (
      <span className={`w-32 shrink-0 truncate ${phase.depth > 0 ? 'text-muted-foreground' : ''}`}>
      {PHASE_LABELS[phase.phase]}
      </span>
    )}

    <span className="h-2 min-w-0 flex-1 overflow-clip rounded-full bg-muted-foreground/30">
      <span
        className="block h-full rounded-full bg-primary"
        style={{ width: `${Math.max((phase.ms / longest) * 100, 2)}%` }}
      />
    </span>

    <span className="mono w-14 shrink-0 text-right tabular-nums">{formatMs(phase.ms)}</span>
  </div>
);
