// How a duration prints in the perf card. Sub-millisecond reads are real and common — a warm
// SKILL.md comes back in a fraction of one — so the small end keeps a decimal rather than
// rounding a whole column to `0 ms`.
export const formatMs = (ms: number): string => {
  if (ms < 1) return `${ms.toFixed(1)} ms`;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
};
