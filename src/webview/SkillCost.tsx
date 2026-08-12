import { BudgetReading, readBudget } from '../model/settings/budget';
import {
  getBudget,
  SKILL_BUDGET_FIELDS,
  SkillBudgetField,
  skillTokens
} from '../model/settings/skill-budget';
import { SkillEntry } from '../model/types';
import { BudgetBar, budgetTextClass } from './BudgetBar';
import { BudgetInfo } from './BudgetInfo';
import { formatBytes, formatTokens } from './format-size';
import { useSettings } from './settings/SettingsContext';
import { FIELD_LABELS, FIELD_NOTES } from './skill-budget-labels';

interface SkillCostProps {
  skill: SkillEntry;
}

// What a skill costs, which is two numbers rather than one: its name and description sit in the
// system prompt whether or not it ever runs, and the file itself is only read once Claude picks it.
// A single "size" would be answering the wrong question. Each number is read against its budget,
// which is what turns it from a measurement into an answer.
export const SkillCost = ({ skill }: SkillCostProps) => (
  <section className="flex flex-col gap-2">
    <div className="flex items-center gap-1.5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost</h2>
      <BudgetInfo skill={skill} />
    </div>
    <div className="flex flex-col gap-3">
      {SKILL_BUDGET_FIELDS.map((field) => (
        <CostRow key={field} skill={skill} field={field} />
      ))}
    </div>
  </section>
);

interface CostRowProps {
  skill: SkillEntry;
  field: SkillBudgetField;
}

const CostRow = ({ skill, field }: CostRowProps) => {
  const { budgets } = useSettings();
  const tokens: number = skillTokens({ skill, field });
  // A shadowed skill is never listed, so its description costs nothing and there's no budget to
  // read — a bar under a struck-through number would be measuring a cost you don't pay.
  const shadowed: boolean = field === 'description' && skill.shadowedBy !== undefined;
  const reading: BudgetReading | undefined = shadowed
    ? undefined
    : readBudget({ value: tokens, limit: getBudget({ skill, field, budgets }).tokens });

  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-medium">{FIELD_LABELS[field]}</span>
        {/* What it costs, and nothing else. The bar carries the share of the budget and the (i)
            card carries the limit — printing `x / y` here said the same thing a third time. */}
        <span
          className={`mono ${shadowed ? 'line-through opacity-60' : budgetTextClass(reading?.level)}`}
        >
          ~{formatTokens(tokens)} est. tokens
        </span>
      </div>
      {reading && <BudgetBar reading={reading} />}
      <span className="text-muted-foreground">{noteFor({ skill, field, shadowed })}</span>
    </div>
  );
};

interface NoteArgs {
  skill: SkillEntry;
  field: SkillBudgetField;
  shadowed: boolean;
}

// The line under the bar. Only `content` carries a byte count — it's the one you'd open in an
// editor, so its size on disk is a number you can act on.
const noteFor = ({ skill, field, shadowed }: NoteArgs): string => {
  if (shadowed) return 'nothing — a shadowed skill is never listed';
  if (field === 'content') return `${formatBytes(skill.chars)} · ${FIELD_NOTES[field]}`;

  return FIELD_NOTES[field];
};
