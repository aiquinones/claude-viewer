import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SKILL_SCOPES, Reveal, SkillEntry, SkillScope } from '../model/types';
import { SkillRow } from './SkillRow';
import { formatTokens } from './format-size';
import { listed, listingTotals } from './skill-totals';

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
        // A collapsed group still says how many of its skills are being ignored, and what the ones
        // that aren't cost — plugin scope being the long tail is the thing worth seeing.
        const shadowedCount: number = inScope.filter((skill) => skill.shadowedBy).length;
        const listingTokens: number = listingTotals(listed(inScope)).estimatedTokens;

        return (
          <section key={scope} className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => toggle(scope)}
              title={`${SCOPE_LABEL[scope]} skills · ~${formatTokens(listingTokens)} est. tokens of descriptions in the system prompt`}
              className="flex w-full items-center gap-1 rounded-md px-3 py-1 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:bg-accent"
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
              <span>
                {SCOPE_LABEL[scope]} · {inScope.length}
                {shadowedCount > 0 && ` · ${shadowedCount} shadowed`}
                <span className="normal-case font-normal"> · ~{formatTokens(listingTokens)}</span>
              </span>
            </button>

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
