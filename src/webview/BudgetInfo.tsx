import { ExternalLink, Info, SlidersHorizontal } from 'lucide-react';
import { BudgetSource, BudgetValue } from '../model/settings/settings';
import {
  getBudget,
  SKILL_BUDGET_FIELDS,
  SkillBudgetField
} from '../model/settings/skill-budget';
import { SkillEntry } from '../model/types';
import { Button } from '@/components/ui/button';
import { formatTokens } from './format-size';
import { useOpenSettings, useSettings } from './settings/SettingsContext';
import { FIELD_CONTEXT, FIELD_LABELS, SKILL_DOCS_URL } from './skill-budget-labels';
import { Z } from './z-layers';

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
// with the way to change them. It owns its own hover card, so there's still no popover library.
export const BudgetInfo = ({ skill }: BudgetInfoProps) => {
  const { budgets } = useSettings();
  const openSettings = useOpenSettings();

  return (
    <span className="group relative inline-flex">
      {/* Not a button — nothing happens on click, and the CTA lives inside the card. Tabbing here
          opens it via group-has-focus-visible, and tabbing on walks into that button. */}
      <span
        tabIndex={0}
        aria-describedby={CARD_ID}
        className="inline-flex cursor-default rounded-sm text-muted-foreground group-hover:text-foreground group-has-focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Info className="size-3.5" />
        <span className="sr-only">where these budgets come from</span>
      </span>

      {/* `pt-1.5` rather than a margin, so the gap under the icon is still inside the group and the
          card survives the mouse crossing it. */}
      <div
        id={CARD_ID}
        style={{ zIndex: Z.card }}
        className="invisible absolute left-0 top-full pt-1.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-has-focus-visible:visible group-has-focus-visible:opacity-100"
      >
        {/* `w-max` rather than a fixed width: the source phrases differ in length — "the default"
            against "your override for this skill" — and a fixed box wrapped the long one onto a
            hanging second line. The context paragraphs cap themselves at CONTEXT_WIDTH, which is
            what stops max-content from being one very long line. The max-width is the panel less
            the skills list, so a narrow panel still clips rather than scrolls. */}
        <div className="flex w-max max-w-[calc(100vw-22rem)] flex-col gap-2 rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
          {/* Where the numbers come from, said once at the top, so the four source phrases below
              read as answers rather than as something you have to infer. */}
          <div className="flex items-center justify-between gap-6 border-b border-border pb-2">
            <span className="text-muted-foreground">Budgets come from your settings</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto shrink-0 p-0 text-xs"
              onClick={() => openSettings('budgets')}
            >
              <SlidersHorizontal className="size-3.5" />
              Change
            </Button>
          </div>
          <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
            {SKILL_BUDGET_FIELDS.map((field) => (
              <SourceLine key={field} field={field} budget={getBudget({ skill, field, budgets })} />
            ))}
          </dl>
          {/* The rules the paragraphs lean on are Claude Code's and move on its release schedule,
              so the card points at them rather than restating them and going stale. The border is
              on the wrapper because `self-start` on a bordered anchor rules only the words. `pt-3`
              against the card's own `gap-2` above the rule, rather than matching it: the paragraph
              above ends on a line box with descender space under it, so equal padding reads as the
              link sitting closer to the rule than the prose does. */}
          <div className="border-t border-border pt-3">
            <a
              href={SKILL_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="flat-focus inline-flex items-center gap-1 text-link hover:underline"
            >
              <ExternalLink className="size-3.5" />
              More info
            </a>
          </div>
        </div>
      </div>
    </span>
  );
};

// One card per detail pane — only the selected skill renders a Cost section.
const CARD_ID: string = 'budget-info-card';

// What the paragraphs wrap at. Wide enough that neither runs to four lines, narrow enough to stay
// readable — and it's this, not the card, that decides how wide `w-max` resolves.
const CONTEXT_WIDTH: string = 'max-w-[46ch]';

interface SourceLineProps {
  field: SkillBudgetField;
  budget: BudgetValue;
}

// A fragment, not a wrapper: the dt and the dd have to be direct children of the grid, or the two
// rows stop sharing a column and the labels no longer line up. The context paragraph is a second
// dd spanning both columns — it belongs to the same term, and a label column would squash it.
const SourceLine = ({ field, budget }: SourceLineProps) => (
  <>
    <dt className="text-muted-foreground">{FIELD_LABELS[field]}</dt>
    <dd>
      <span className="mono">
        {budget.tokens === 0 ? 'off' : `${formatTokens(budget.tokens)} est. tokens`}
      </span>
      <span className="text-muted-foreground"> · {SOURCE_LABELS[budget.source]}</span>
    </dd>
    <dd className={`col-span-2 mb-1 text-muted-foreground last:mb-0 ${CONTEXT_WIDTH}`}>
      {FIELD_CONTEXT[field]}
    </dd>
  </>
);
