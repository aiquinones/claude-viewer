// How long ago something happened, in one unit. Rendered next to a live badge, so it favors being
// short and honest over being precise — the difference between 90s and 92s says nothing.

const SECOND: number = 1000;
const MINUTE: number = 60 * SECOND;
const HOUR: number = 60 * MINUTE;
const DAY: number = 24 * HOUR;

export const formatAge = (ms: number): string => {
  // Two clocks — a file's mtime and the panel's — can disagree by a hair the wrong way.
  if (ms < SECOND) return 'now';
  if (ms < MINUTE) return `${Math.floor(ms / SECOND)}s`;
  if (ms < HOUR) return `${Math.floor(ms / MINUTE)}m`;
  if (ms < DAY) return `${Math.floor(ms / HOUR)}h`;
  return `${Math.floor(ms / DAY)}d`;
};
