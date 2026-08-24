import { ReactNode } from 'react';
import { findSkillByName } from '../model/shadowing';
import { SkillEntry } from '../model/types';
import { UsageMetric, UsageSlice, UsageSummaryData } from '../model/usage/types';
import { UsageBar } from './UsageBar';
import { sliceLabel } from './usage-format';

interface UsageSlicesProps {
  // A window of the usage surface, or one session. The rows are the same rows either way — which
  // set of turns they came out of isn't something this has to know.
  summary: UsageSummaryData;
  metric: UsageMetric;
  // What to say when nothing is in it. The sentence is the caller's: an empty window suggests a
  // wider one, an empty session says the session ran no skills, and neither is advice for the other.
  empty: ReactNode;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
}

// What the turns cost, split by the skill that was running. Shared by the usage surface and the
// session analysis page, so one session's breakdown and a week's read the same way.
export const UsageSlices = ({ summary, metric, empty, skills, onOpenSkill }: UsageSlicesProps) => {
  if (summary.slices.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  }

  // Bars are scaled to the biggest row rather than to 100%, so a window nothing dominates still has
  // something to compare. The share beside each one is the real number.
  const scale: number = Math.max(...summary.slices.map((slice) => slice.fraction));

  return (
    <section className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {summary.slices.map((slice: UsageSlice) => (
        <UsageBar
          key={sliceLabel(slice)}
          slice={slice}
          metric={metric}
          scale={scale}
          // The skill that would actually run under that name, which is the one the turn used —
          // a shadowed copy never reaches the system prompt, so it can't be what was invoked.
          skill={slice.skill ? findSkillByName({ skills, name: slice.skill }) : undefined}
          onOpenSkill={onOpenSkill}
        />
      ))}
    </section>
  );
};
