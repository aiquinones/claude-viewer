import { Tooltip } from './Tooltip';

export interface ChoiceOption<Id extends string> {
  id: Id;
  label: string;
  // What the option means, on hover. Every one of these picks between two readings of the same
  // sessions, and the label alone can't say which.
  hint: string;
}

interface UsageChoiceProps<Id extends string> {
  label: string;
  options: readonly ChoiceOption<Id>[];
  value: Id;
  onChange: (value: Id) => void;
}

// A segmented control with words in it. `ViewModeToggle` is the icon version and slides a tile
// between equal-width buttons; these options are words of different lengths — Day against
// This workspace — so the selected one is painted rather than chased.
export const UsageChoice = <Id extends string>({
  label,
  options,
  value,
  onChange
}: UsageChoiceProps<Id>) => (
  <div
    role="group"
    aria-label={label}
    className="flex shrink-0 items-center rounded-lg border border-border bg-muted p-0.5"
  >
    {options.map((option) => (
      <Tooltip key={option.id} label={option.hint}>
        <button
          type="button"
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs transition-colors ${
            option.id === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      </Tooltip>
    ))}
  </div>
);
