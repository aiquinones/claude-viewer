import { Info, SlidersHorizontal } from 'lucide-react';
import { BudgetSource, BudgetValue } from '../model/settings/settings';
import { getBudget, SKILL_BUDGET_FIELDS } from '../model/settings/skill-budget';
import { SkillEntry } from '../model/types';
import { Button } from '@/components/ui/button';
import { formatTokens } from './format-size';
import { useOpenSettings, useSettings } from './settings/SettingsContext';
import { FIELD_LABELS } from './skill-budget-labels';

interface BudgetInfoProps {
  skill: SkillEntry;
}

// Where a limit came from, as a sentence. Without this the bars are numbers you have no way to
// argue with — you can't change a budget you don't know you set.
const SOURCE_LABELS: Record<BudgetSource, string> = {
  override: 'your override for this skill',
  workspace: 'set for this workspace',
  user: 'set by you',
  default: 'the default'
};

// The (i) beside the Cost heading. Hover or focus opens a card naming both limits and their source,
// with the way to change them. Same card shape as WinnerCrown, so there's still no popover library.
export const BudgetInfo = ({ skill }: BudgetInfoProps) => {
  const { budgets } = useSettings();
  const openSettings: () => void = useOpenSettings();

  return (
    <span className="group relative inline-flex">
      {/* Not a button — nothing happens on click, and the CTA lives inside the card. Tabbing here
          opens it via group-focus-within, and tabbing on walks into that button. */}
      <span
        tabIndex={0}
        aria-describedby={CARD_ID}
        className="inline-flex cursor-default rounded-sm text-muted-foreground group-hover:text-foreground group-focus-within:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Info className="size-3.5" />
        <span className="sr-only">where these budgets come from</span>
      </span>

      {/* `pt-1.5` rather than a margin, so the gap under the icon is still inside the group and the
          card survives the mouse crossing it. `z-20` clears the body's sticky headings. */}
      <div
        id={CARD_ID}
        className="invisible absolute left-0 top-full z-20 pt-1.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {/* `w-max` rather than a fixed width: the source phrases differ in length — "the default"
            against "your override for this skill" — and a fixed box wrapped the long one onto a
            hanging second line. The max-width is the panel less the skills list, so a narrow panel
            still clips rather than scrolls. */}
        <div className="flex w-max max-w-[calc(100vw-22rem)] flex-col gap-2 rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
          {/* Where the numbers come from, said once at the top, so the four source phrases below
              read as answers rather than as something you have to infer. */}
          <div className="flex items-center justify-between gap-6 border-b border-border pb-2">
            <span className="text-muted-foreground">Budgets come from your settings</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto shrink-0 p-0 text-xs"
              onClick={openSettings}
            >
              <SlidersHorizontal className="size-3.5" />
              Change
            </Button>
          </div>
          <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
            {SKILL_BUDGET_FIELDS.map((field) => (
              <SourceLine
                key={field}
                label={FIELD_LABELS[field]}
                budget={getBudget({ skill, field, budgets })}
              />
            ))}
          </dl>
        </div>
      </div>
    </span>
  );
};

// One card per detail pane — only the selected skill renders a Cost section.
const CARD_ID: string = 'budget-info-card';

interface SourceLineProps {
  label: string;
  budget: BudgetValue;
}

// A fragment, not a wrapper: the dt and the dd have to be direct children of the grid, or the two
// rows stop sharing a column and the labels no longer line up.
const SourceLine = ({ label, budget }: SourceLineProps) => (
  <>
    <dt className="text-muted-foreground">{label}</dt>
    <dd>
      <span className="mono">
        {budget.tokens === 0 ? 'off' : `${formatTokens(budget.tokens)} est. tokens`}
      </span>
      <span className="text-muted-foreground"> · {SOURCE_LABELS[budget.source]}</span>
    </dd>
  </>
);
