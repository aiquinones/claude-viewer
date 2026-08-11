interface ProgressBarProps {
  // How far along, 0..1. Ignored while indeterminate.
  fraction: number;
  // Nothing knows how far along this is any more, so the fill sweeps instead of filling.
  indeterminate: boolean;
}

// The track and its fill. Color comes from `--surface-accent` where a view sets one, so the bar
// matches the surface you're waiting on without either side knowing about the other.
export const ProgressBar = ({ fraction, indeterminate }: ProgressBarProps) => (
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={1}
    // Omitted while sweeping — that's what tells a screen reader the value is unknown.
    aria-valuenow={indeterminate ? undefined : fraction}
    className="h-1 w-full max-w-56 overflow-hidden rounded-full bg-muted"
  >
    {indeterminate ? (
      <div className="progress-sweep h-full w-1/4 rounded-full" />
    ) : (
      <div className="progress-fill h-full rounded-full" style={{ width: `${fraction * 100}%` }} />
    )}
  </div>
);
