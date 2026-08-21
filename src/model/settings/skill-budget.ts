// Which budget applies to a given skill, and which number on the entry it limits.

import { SkillEntry } from '../types';
import { Budgets, BudgetValue, SkillBudgets } from './settings';

// The two things a skill costs. One home for the pair: the settings keys, the resolver and the two
// rows in the Cost section all derive from it.
//
// Deliberately not annotated: a type here would erase the literals `SkillBudgetField` derives from.
export const SKILL_BUDGET_FIELDS = ['description', 'content'] as const;

export type SkillBudgetField = (typeof SKILL_BUDGET_FIELDS)[number];

interface SkillCharsArgs {
  skill: SkillEntry;
  field: SkillBudgetField;
}

// `description` is the name-and-description line that sits in the system prompt on every request;
// `content` is the whole SKILL.md, read only once Claude picks the skill.
//
// Chars rather than tokens, so this file stays as free of the estimator as `budget.ts` is of
// skills — turning it into a token count is the webview's job, because that's where the setting is.
export const skillChars = ({ skill, field }: SkillCharsArgs): number =>
  field === 'description' ? skill.listingChars : skill.chars;

interface GetBudgetArgs {
  skill: SkillEntry;
  field: SkillBudgetField;
  budgets: Budgets;
}

// Override → your value → default. The override is resolved here rather than host-side because
// only the webview knows which skill you're looking at.
export const getBudget = ({ skill, field, budgets }: GetBudgetArgs): BudgetValue => {
  const skills: SkillBudgets = budgets.skills;
  const override: number | undefined = skills.overrides[skill.name]?.[field];
  if (override !== undefined) return { tokens: override, source: 'override' };

  return skills[field];
};
