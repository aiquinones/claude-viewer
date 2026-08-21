import { useEffect, useState } from 'react';
import { SKILL_SCOPES, Reveal, SkillEntry, SkillScope } from '../model/types';
import { CollapsibleHeading } from './CollapsibleHeading';
import { SkillRow } from './SkillRow';
import { TokenEstimate } from './TokenEstimate';
import { listed } from '../model/shadowing';
import { listingTotals } from './skill-totals';

interface SkillListProps {
  skills: SkillEntry[];
  selectedPath: string | undefined;
  reveal?: Reveal;
  onSelect: (skill: SkillEntry) => void;
}

const SCOPE_LABEL: Record<SkillScope, string> = {
  project: 'Project',
  user: 'User',
  plugin: 'Plugin'
};

// Grouped by scope in precedence order, so the list itself shows which skills win by sitting
// first. Plugin scope is the long tail — collapsing it gets your own skills back on one screen.
export const SkillList = ({ skills, selectedPath, reveal, onSelect }: SkillListProps) => {
  const [collapsed, setCollapsed] = useState<SkillScope[]>([]);

  // Plugin scope is the group people collapse, and it's where a deep link most often lands.
  // Expanding just that group leaves every other manual collapse alone.
  useEffect(() => {
    if (!reveal) return;
    const revealed: SkillEntry | undefined = skills.find((skill) => skill.path === reveal.path);
    if (!revealed) return;
    setCollapsed((previous) => previous.filter((scope) => scope !== revealed.scope));
  }, [reveal]);

  const toggle = (scope: SkillScope): void =>
    setCollapsed((previous) =>
      previous.includes(scope)
        ? previous.filter((entry) => entry !== scope)
        : [...previous, scope]
    );

  return (
    // `px-2` is the gutter the rows' highlight sits in — they're `w-full`, so without it the pill
    // runs into the pane's edges instead of floating inside them.
    <div className="flex flex-col gap-4 px-2">
      {SKILL_SCOPES.map((scope) => {
        const inScope: SkillEntry[] = skills.filter((skill) => skill.scope === scope);
        if (inScope.length === 0) return null;

        const isCollapsed: boolean = collapsed.includes(scope);
        // A collapsed group still says what the skills in it cost — plugin scope being the long
        // tail is the thing worth seeing. Which of them are shadowed is a per-row matter, and the
        // rows already say so.
        const listingChars: number = listingTotals(listed(inScope)).chars;

        return (
          <section key={scope} className="flex flex-col gap-1">
            <CollapsibleHeading
              title={`${SCOPE_LABEL[scope]} · ${inScope.length}`}
              note={<TokenEstimate chars={listingChars} />}
              tooltip={`${SCOPE_LABEL[scope]} skills · what their descriptions cost in the system prompt`}
              collapsed={isCollapsed}
              onToggle={() => toggle(scope)}
            />

            {!isCollapsed &&
              inScope.map((skill) => (
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
};
