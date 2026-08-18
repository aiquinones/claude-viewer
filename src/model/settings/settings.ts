// The extension's own settings — the shape the host resolves and the webview reads. Nothing here
// is Claude's config: these are `claudeViewer.*` keys, and `~/.claude` is still never written.

import { z } from 'zod';

// Where a limit came from, most specific first. The array is the order `getBudget` walks, and the
// (i) card prints whichever one won.
//
// Deliberately not annotated: a type here would erase the literals `BudgetSource` derives from.
export const BUDGET_SOURCES = ['override', 'workspace', 'user', 'default'] as const;

export type BudgetSource = (typeof BUDGET_SOURCES)[number];

// A limit and the reason it's that number. The two travel together everywhere — a limit with no
// provenance can be shown but not explained, and explaining it is half the point.
export interface BudgetValue {
  // Estimated tokens. 0 turns the budget off.
  tokens: number;
  source: BudgetSource;
}

// A per-skill limit. Either field may be absent — overriding one doesn't mean setting the other.
export interface SkillBudgetOverride {
  description?: number;
  content?: number;
}

export interface SkillBudgets {
  description: BudgetValue;
  content: BudgetValue;
  // Keyed by skill name rather than path: the name is what you'd type, and it's what collides.
  overrides: Record<string, SkillBudgetOverride>;
}

export interface Budgets {
  skills: SkillBudgets;
}

export interface ViewerSettings {
  budgets: Budgets;
}

// Measured against real skills. Anthropic's 17 official ones run ~55 to ~235 est. tokens per
// listing (~80 median) and ~275 to ~8,000 per body (~2,000 median); 52 skills on one real machine
// come out at 61 and ~1,000 median. So the content default is the published median, and the
// description default is a little above it. A skill at the default is comfortable; one at twice it
// is saying something.
export const DEFAULT_DESCRIPTION_BUDGET: number = 100;
export const DEFAULT_CONTENT_BUDGET: number = 2000;

export const DEFAULT_SETTINGS: ViewerSettings = {
  budgets: {
    skills: {
      description: { tokens: DEFAULT_DESCRIPTION_BUDGET, source: 'default' },
      content: { tokens: DEFAULT_CONTENT_BUDGET, source: 'default' },
      overrides: {}
    }
  }
};

// A budget as it arrives from settings.json. Anything that isn't a non-negative number is dropped
// so the default applies — a budget of `"lots"` shouldn't silently become zero.
const budgetTokensSchema = z.number().finite().nonnegative();

const overrideSchema = z.object({
  description: budgetTokensSchema.optional(),
  content: budgetTokensSchema.optional()
});

export const parseBudgetTokens = (raw: unknown): number | undefined => {
  const parsed = budgetTokensSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
};

// One bad entry drops itself rather than the whole map, so a typo in one skill's override doesn't
// silently turn off everyone else's.
export const parseOverrides = (raw: unknown): Record<string, SkillBudgetOverride> => {
  const record = z.record(z.unknown()).safeParse(raw);
  if (!record.success) return {};

  const overrides: Record<string, SkillBudgetOverride> = {};
  for (const [name, value] of Object.entries(record.data)) {
    const entry = overrideSchema.safeParse(value);
    if (entry.success) overrides[name] = entry.data;
  }
  return overrides;
};
