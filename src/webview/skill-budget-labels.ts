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

// The same two facts at length, for the (i) card. The bars assume you already know when each cost
// lands and what a normal one looks like; this is where that gets said.
//
// The numbers are measured, not guessed. Anthropic's 17 official skills run ~55 to ~235 est. tokens
// per description (~80 median, ~1,700 for all 17 together) and ~275 to ~8,000 per body (~2,000
// median). 52 skills on one real machine agree: descriptions 61 median and 231 at the top, bodies
// ~1,000 median and 8,246 at the top. Rounded here, since the point is the shape of the range.
export const FIELD_CONTEXT: Record<SkillBudgetField, string> = {
  description:
    'In the system prompt on every request, and every skill is listed at once — so one you never invoke still costs this. ~80 est. tokens is typical, but the whole listing is capped at 1% of the context window, and descriptions start getting dropped when it overflows.',
  content:
    'Read only once Claude picks the skill, and it stays in context for the rest of the session. Size follows what the skill does: ~275 est. tokens for a simple one, ~2,000 for a typical one, ~8,000 for the largest official ones.'
};

// Where both facts come from. The card links it rather than restating the rules — the listing
// budget and the 500-line guidance are Claude Code's, and they change on its release schedule.
export const SKILL_DOCS_URL: string =
  'https://code.claude.com/docs/en/skills#add-supporting-files';
