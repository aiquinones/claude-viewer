import { useEffect, useState } from 'react';

// The current time, re-read on an interval. Every other surface renders a snapshot that only
// changes when the disk does; a list of live agents also changes because time passed, and this is
// the only thing that tells it so.
export const useNow = (intervalMs: number): number => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer: ReturnType<typeof setInterval> = setInterval(
      () => setNow(Date.now()),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};
