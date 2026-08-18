import { SkillHoverCard } from '../SkillHoverCard';
import { FlowSkillRef } from './steps';

interface SkillChipProps {
  reference: FlowSkillRef;
  onOpenSkill: (path: string) => void;
}

// One skill this section names. Hovering shows what that skill is for, clicking goes and reads it.
export const SkillChip = ({ reference, onOpenSkill }: SkillChipProps) => (
  <SkillHoverCard skill={reference.skill}>
    <button
      type="button"
      onClick={() => onOpenSkill(reference.skill.path)}
      className="mono flex cursor-pointer items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground transition-colors hover:border-[var(--surface-accent,var(--foreground))] hover:text-foreground"
    >
      {reference.skill.name}
      {reference.count > 1 && (
        <span className="text-[0.625rem] text-muted-foreground/70">×{reference.count}</span>
      )}
    </button>
  </SkillHoverCard>
);
