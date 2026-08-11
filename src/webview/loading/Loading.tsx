import { useEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { Robot } from './Robot';
import { useCrawl } from './useCrawl';

interface LoadingProps {
  // What the mounting point is waiting on.
  label: string;
  // A real fraction, 0..1, if this load ever reports one.
  progress?: number;
  // Otherwise, how long it usually takes.
  expectedMs?: number;
  // One blink-and-glance cycle of the robot.
  tickMs?: number;
  // Nothing paints before this.
  delayMs?: number;
}

// Long enough that a file read off a warm disk shows nothing at all. A robot that flashes in and
// out for one frame is worse than the grey text this replaced.
const DEFAULT_DELAY_MS: number = 120;

const DEFAULT_EXPECTED_MS: number = 700;

// Every wait in the panel: the robot, what we're waiting on, and how far along it is. Layout is
// the caller's — this centers its own column and nothing else, so it drops into a section as
// readily as into a whole empty panel.
export const Loading = ({
  label,
  progress,
  expectedMs = DEFAULT_EXPECTED_MS,
  tickMs,
  delayMs = DEFAULT_DELAY_MS
}: LoadingProps) => {
  const { fraction, indeterminate } = useCrawl({ expectedMs, progress });
  // The crawl starts at mount rather than at first paint, so the bar arrives already moving.
  const past: boolean = usePastDelay(delayMs);

  if (!past) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground"
    >
      <Robot tickMs={tickMs} />
      <p className="text-sm">{label}</p>
      <ProgressBar fraction={fraction} indeterminate={indeterminate} />
    </div>
  );
};

// True once `delayMs` has passed since mount, or immediately when there's no delay to wait out.
const usePastDelay = (delayMs: number): boolean => {
  const [past, setPast] = useState<boolean>(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const timer: number = window.setTimeout(() => setPast(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return past;
};
