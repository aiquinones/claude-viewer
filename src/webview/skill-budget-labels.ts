import { SkillBudgetField } from '../model/settings/skill-budget';

// How each budget field reads in the panel. The Cost rows and the (i) card both print the label,
// so it lives in one place rather than agreeing by coincidence.
export const FIELD_LABELS: Record<SkillBudgetField, string> = {
  description: 'Description',
  content: 'Content'
};

// When you pay for each one, which is the whole reason a skill has two numbers.
export const FIELD_NOTES: Record<SkillBudgetField, string> = {
  description: 'name and description, on every request',
  content: 'the whole SKILL.md, read when the skill runs'
};
