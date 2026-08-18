import { SkillEntry } from '../model/types';
import { UsageMetric, UsageSlice } from '../model/usage/types';
import { SkillHoverCard } from './SkillHoverCard';
import { formatShare, formatSliceValue, sliceLabel } from './usage-format';

interface UsageBarProps {
  slice: UsageSlice;
  metric: UsageMetric;
  // Of the largest slice's share, so the longest bar fills the row. Shares are read off the number
  // beside the bar; the bar itself is for comparing rows to each other.
  scale: number;
  // The skill this row names, where it's installed here. Usage spans every session on the machine,
  // so a row can name a skill this workspace has never seen — that one is a label and nothing more.
  skill?: SkillEntry;
  onOpenSkill?: (path: string) => void;
}

// One skill's share of the window. The bar is drawn in the surface's accent, except for the turns
// that ran with no skill — those are the baseline everything else is measured against, not a
// participant.
export const UsageBar = ({ slice, metric, scale, skill, onOpenSkill }: UsageBarProps) => {
  const attributed: boolean = slice.skill !== undefined;
  const inferred: boolean = slice.sources.includes('inferred');

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-baseline gap-2.5">
        <Label slice={slice} attributed={attributed} skill={skill} onOpenSkill={onOpenSkill} />
        {inferred && (
          <span
            title={
              slice.sources.length > 1
                ? 'Part of this is inferred — Copilot announces a skill and never closes it, so it claims every turn until the next one.'
                : 'Inferred — Copilot announces a skill and never closes it, so it claims every turn until the next one.'
            }
            className="shrink-0 rounded border border-dashed border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            inferred
          </span>
        )}
        <span className="ml-auto shrink-0 text-sm tabular-nums">
          {formatSliceValue(slice, metric)}
        </span>
        <span className="w-11 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
          {formatShare(slice.fraction)}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${attributed ? 'usage-fill' : 'bg-muted-foreground/40'}`}
          style={{
            width: `${Math.min(scale === 0 ? 0 : slice.fraction / scale, 1) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

interface LabelProps {
  slice: UsageSlice;
  attributed: boolean;
  skill: SkillEntry | undefined;
  onOpenSkill: ((path: string) => void) | undefined;
}

// The row's name. It becomes a button only when there's a skill on disk behind it — a name that
// can't be opened shouldn't look like it can, and most of the rows on a machine-wide window are
// skills that live somewhere else.
const Label = ({ slice, attributed, skill, onOpenSkill }: LabelProps) => {
  const text: string = sliceLabel(slice);
  const weight: string = attributed ? 'font-medium' : 'text-muted-foreground italic';

  if (!skill || !onOpenSkill) {
    return <span className={`truncate text-sm ${weight}`}>{text}</span>;
  }

  // `min-w-0` on the wrapper is what keeps the name truncating: the hover card's span is a flex
  // item here, and one that won't shrink pushes the numbers off the end of the row.
  return (
    <SkillHoverCard skill={skill} className="min-w-0">
      <button
        type="button"
        onClick={() => onOpenSkill(skill.path)}
        className={`cursor-pointer truncate text-sm transition-colors hover:text-[var(--surface-accent,var(--foreground))] hover:underline ${weight}`}
      >
        {text}
      </button>
    </SkillHoverCard>
  );
};
