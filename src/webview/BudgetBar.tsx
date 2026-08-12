import { BudgetLevel, BudgetReading } from '../model/settings/budget';

interface BudgetBarProps {
  reading: BudgetReading;
}

// A `within` bar is muted rather than green. Color appears only where it means something —
// a panel where every healthy skill glows is a panel you stop reading.
const FILL: Record<BudgetLevel, string> = {
  within: 'bg-muted-foreground',
  near: 'bg-warn',
  over: 'bg-error'
};

// What a measured number costs against its budget. A sibling of loading/ProgressBar rather than a
// reuse of it: that one takes its color from --surface-accent and can't exceed its track.
export const BudgetBar = ({ reading }: BudgetBarProps) => (
  <div
    role="meter"
    aria-valuemin={0}
    aria-valuemax={reading.limit}
    aria-valuenow={reading.value}
    aria-label={`${reading.value} of ${reading.limit} estimated tokens`}
    className="h-1 w-full overflow-hidden rounded-full bg-muted"
  >
    {/* Clamped: over budget reads as a full bar rather than one that quietly runs past its track. */}
    <div
      className={`h-full rounded-full ${FILL[reading.level]}`}
      style={{ width: `${Math.min(reading.fraction, 1) * 100}%` }}
    />
  </div>
);

// The number itself, tinted to match. Same rule — `within` stays plain.
export const budgetTextClass = (level: BudgetLevel | undefined): string => {
  if (level === 'over') return 'text-error';
  if (level === 'near') return 'text-warn';
  return '';
};
