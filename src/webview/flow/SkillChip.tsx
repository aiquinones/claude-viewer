import { FlowSkillRef } from './steps';

interface SkillChipProps {
  reference: FlowSkillRef;
  onOpenSkill: (path: string) => void;
}

// One skill this section names. Hovering shows what that skill is for, clicking goes and reads it.
//
// Not `Tooltip`: that one is `whitespace-nowrap` because it holds a label and a key cap, and a
// description is a paragraph. Same hover mechanics, a box that wraps.
export const SkillChip = ({ reference, onOpenSkill }: SkillChipProps) => (
  <span className="group relative inline-flex">
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

    <span
      role="tooltip"
      className="pointer-events-none absolute left-0 top-full z-30 mt-1 w-64 rounded-md border border-border bg-popover p-2 text-xs leading-relaxed text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
    >
      <span className="mono block font-semibold text-foreground">{reference.skill.name}</span>
      <span className="mt-1 block text-muted-foreground">
        {reference.skill.description || 'no description'}
      </span>
    </span>
  </span>
);
