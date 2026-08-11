import { useEffect, useState } from 'react';

interface UseCrawlArgs {
  // How long this load usually takes. The crawl is paced to reach the ceiling here.
  expectedMs: number;
  // A real fraction, 0..1, when the caller has one. It wins — no crawling over a known answer.
  progress?: number;
}

interface Crawl {
  fraction: number;
  indeterminate: boolean;
}

// Where the crawl stops. Never 100%: the bar has no idea whether the work is done, and finishing
// on a guess is the one thing a progress bar can't take back.
const CEILING: number = 0.9;

// How long it sits at the ceiling before giving up and sweeping. Without it, a load that runs a
// hair past `expectedMs` flashes the sweep for a frame or two.
const HOLD_MS: number = 400;

// Decelerating: most of the bar fills early, which is where the impression of speed is.
const easeOut = (time: number): number => 1 - (1 - time) ** 3;

// A fraction to draw when nothing reports one. It crawls to 90% over `expectedMs`, holds, and then
// admits it doesn't know — `indeterminate` is the honest answer for a load that outran its
// estimate, and a sweeping bar says that where a bar frozen at 90% says "hung".
export const useCrawl = ({ expectedMs, progress }: UseCrawlArgs): Crawl => {
  const [fraction, setFraction] = useState<number>(0);
  const [overrun, setOverrun] = useState<boolean>(false);
  const known: boolean = progress !== undefined;

  useEffect(() => {
    if (known) return;

    const start: number = performance.now();
    let frame: number = 0;

    // Stops at `expectedMs` rather than running for the life of the component: past the ceiling
    // the fill doesn't move, and an 8-second load shouldn't cost 8 seconds of frames.
    const tick = (): void => {
      const elapsed: number = performance.now() - start;
      setFraction(CEILING * easeOut(Math.min(elapsed / expectedMs, 1)));
      if (elapsed < expectedMs) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const timer: number = window.setTimeout(() => setOverrun(true), expectedMs + HOLD_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [known, expectedMs]);

  if (progress !== undefined) {
    return { fraction: Math.min(Math.max(progress, 0), 1), indeterminate: false };
  }

  return { fraction, indeterminate: overrun };
};
