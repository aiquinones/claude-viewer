import { EyeOff } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { cn } from '@/lib/utils';

interface SkillRowProps {
  skill: SkillEntry;
  selected: boolean;
  onSelect: (skill: SkillEntry) => void;
}

export const SkillRow = ({ skill, selected, onSelect }: SkillRowProps) => {
  const shadowed: boolean = skill.shadowedBy !== undefined;
  const worstIssue: string | undefined = skill.issues.find(
    (issue) => issue.severity === 'error'
  )?.message;

  return (
    <button
      type="button"
      onClick={() => onSelect(skill)}
      className={cn(
        'flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left cursor-pointer',
        selected ? 'bg-selected text-selected-foreground' : 'hover:bg-accent',
        shadowed && !selected && 'opacity-55'
      )}
    >
      <span className="flex items-center gap-2">
        {shadowed && <EyeOff className="size-3.5 shrink-0" />}
        <span className="truncate text-sm font-medium">{skill.name}</span>
        {skill.issues.length > 0 && (
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              worstIssue ? 'bg-error' : 'bg-warn'
            )}
          />
        )}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {skill.description || worstIssue || 'no description'}
      </span>
    </button>
  );
};
