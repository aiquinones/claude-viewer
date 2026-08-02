import { Scope, SkillEntry } from '../model/types';
import { SkillRow } from './SkillRow';

interface SkillListProps {
  skills: SkillEntry[];
  selectedPath: string | undefined;
  onSelect: (skill: SkillEntry) => void;
}

const SCOPE_ORDER: Scope[] = ['project', 'user', 'plugin'];

const SCOPE_LABEL: Record<Scope, string> = {
  project: 'Project',
  user: 'User',
  plugin: 'Plugin'
};

// Grouped by scope in precedence order, so the list itself shows which skills win by sitting first.
export const SkillList = ({ skills, selectedPath, onSelect }: SkillListProps) => (
  <div className="flex flex-col gap-4">
    {SCOPE_ORDER.map((scope) => {
      const inScope: SkillEntry[] = skills.filter((skill) => skill.scope === scope);
      if (inScope.length === 0) return null;

      return (
        <section key={scope} className="flex flex-col gap-1">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {SCOPE_LABEL[scope]} · {inScope.length}
          </h2>
          {inScope.map((skill) => (
            <SkillRow
              key={skill.path}
              skill={skill}
              selected={skill.path === selectedPath}
              onSelect={onSelect}
            />
          ))}
        </section>
      );
    })}
  </div>
);
