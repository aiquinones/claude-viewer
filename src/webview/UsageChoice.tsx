import { CodeText } from './CodeText';
import { HoverCard, HoverCardBody } from './HoverCard';
import { ChoiceOption } from './menu/choice-option';

interface UsageChoiceProps<Id extends string> {
  label: string;
  options: readonly ChoiceOption<Id>[];
  value: Id;
  onChange: (value: Id) => void;
}

// A segmented control with words in it. `ViewModeToggle` is the icon version and slides a tile
// between equal-width buttons; these options are words of different lengths — Day against
// This workspace — so the selected one is painted rather than chased.
//
// The hints are `HoverCard`, not `Tooltip`: they're sentences, and a nowrap tooltip on a control near
// the panel edge is a sentence with its end cut off. An option with no hint is the bare tile — a
// hover card holding nothing would open an empty box.
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
    {options.map((option) => {
      const tile = (
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
      );

      if (!option.hint) return <span key={option.id}>{tile}</span>;

      return (
        <HoverCard
          key={option.id}
          card={
            <HoverCardBody>
              <CodeText text={option.hint} />
            </HoverCardBody>
          }
        >
          {tile}
        </HoverCard>
      );
    })}
  </div>
);
