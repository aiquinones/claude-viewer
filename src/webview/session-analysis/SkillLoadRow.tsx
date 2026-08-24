import { ReactNode } from 'react';
import { plural } from '../format-size';
import { SkillHoverCard } from '../SkillHoverCard';
import { SkillLoad, viaNote } from './skill-loads';

interface SkillLoadRowProps {
  load: SkillLoad;
  // The largest row's size, so the bars compare to each other rather than to nothing.
  scale: number;
  // The size, already formatted, wrapped in whatever explains it — the estimator card, where there
  // is one to open. The row doesn't know about estimators; it draws what it's handed.
  size: ReactNode;
  onOpenSkill: (path: string) => void;
}

// One skill this session loaded. The count is loads rather than intents: Copilot injects a skill
// because you typed its name and then loads it again when the model asks for what it already has,
// and both of those are the body entering the context.
export const SkillLoadRow = ({ load, scale, size, onOpenSkill }: SkillLoadRowProps) => (
  <div className="flex flex-col gap-2 px-4 py-3">
    <div className="flex items-baseline gap-2.5">
      <Name load={load} onOpenSkill={onOpenSkill} />
      <span className="ml-auto shrink-0 text-xs text-muted-foreground" title={viaNote(load)}>
        {plural(load.loads, 'load')}
      </span>
      <span className="shrink-0 text-sm tabular-nums">{size}</span>
    </div>

    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="usage-fill h-full rounded-full"
        style={{ width: `${Math.min(scale === 0 ? 0 : (load.size ?? 0) / scale, 1) * 100}%` }}
      />
    </div>
  </div>
);

interface NameProps {
  load: SkillLoad;
  onOpenSkill: (path: string) => void;
}

// A button only when the skill is installed here. A session on this machine can name a skill that
// lives somewhere else — a plugin that's since been removed, a worktree with its own — and a name
// that can't be opened shouldn't look like it can.
const Name = ({ load, onOpenSkill }: NameProps) => {
  if (!load.skill) {
    return (
      <span className="min-w-0 truncate text-sm font-medium" title="Not installed here">
        {load.name}
      </span>
    );
  }

  const skill = load.skill;

  return (
    <SkillHoverCard skill={skill} className="min-w-0">
      <button
        type="button"
        onClick={() => onOpenSkill(skill.path)}
        className="cursor-pointer truncate text-sm font-medium transition-colors hover:text-[var(--surface-accent,var(--foreground))] hover:underline"
      >
        {load.name}
      </button>
    </SkillHoverCard>
  );
};
