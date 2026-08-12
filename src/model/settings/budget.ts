// Reading a measured number against a limit. Nothing here knows what's being measured, so the next
// surface that wants a budget imports it unchanged and writes only its own resolver.

// Ascending severity — the array is the order.
//
// Deliberately not annotated: a type here would erase the literals `BudgetLevel` derives from.
export const BUDGET_LEVELS = ['within', 'near', 'over'] as const;

export type BudgetLevel = (typeof BUDGET_LEVELS)[number];

// The share of a limit at which a number stops being comfortable.
const NEAR_FRACTION: number = 0.75;

export interface BudgetReading {
  level: BudgetLevel;
  // value / limit, uncapped. The bar clamps its fill; this number stays honest.
  fraction: number;
  value: number;
  limit: number;
}

interface ReadBudgetArgs {
  value: number;
  limit: number;
}

// Undefined when the budget is off, so the caller renders nothing rather than dividing by zero.
export const readBudget = ({ value, limit }: ReadBudgetArgs): BudgetReading | undefined => {
  if (limit <= 0) return undefined;

  const fraction: number = value / limit;
  return { level: levelFor(fraction), fraction, value, limit };
};

const levelFor = (fraction: number): BudgetLevel => {
  if (fraction > 1) return 'over';
  if (fraction >= NEAR_FRACTION) return 'near';
  return 'within';
};
