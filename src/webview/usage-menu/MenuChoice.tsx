import { Check } from 'lucide-react';
import { SettingSource } from '../../model/settings/settings';
import { CodeText } from '../CodeText';
import { ChoiceOption } from '../usage-options';

// Where the setting came from, said in the menu rather than only in the Settings UI — the same
// reason the budgets card names its source.
const SOURCE_NOTE: Record<SettingSource, string> = {
  workspace: 'set for this workspace',
  user: 'set by you',
  default: 'the default'
};

interface MenuChoiceProps<Id extends string> {
  label: string;
  options: readonly ChoiceOption<Id>[];
  value: Id;
  source: SettingSource;
  onChoose: (value: Id) => void;
}

// One setting inside the `...`, as a group of radio rows. The same `ChoiceOption` a segmented
// control draws, except the hint is under the label rather than on hover: a menu is already open, so
// there's nothing to reveal.
export const MenuChoice = <Id extends string>({
  label,
  options,
  value,
  source,
  onChoose
}: MenuChoiceProps<Id>) => (
  <div className="flex flex-col gap-1 py-1.5 first:pt-0 last:pb-0">
    <div className="flex items-baseline gap-2 px-1.5 text-muted-foreground">
      <span>{label}</span>
      <span className="ml-auto shrink-0 text-[0.6875rem]">{SOURCE_NOTE[source]}</span>
    </div>

    {options.map((option) => (
      <MenuChoiceItem
        key={option.id}
        option={option}
        active={option.id === value}
        onChoose={onChoose}
      />
    ))}
  </div>
);

interface MenuChoiceItemProps<Id extends string> {
  option: ChoiceOption<Id>;
  active: boolean;
  onChoose: (value: Id) => void;
}

// A check on the active one, which a contributed VS Code menu can't do — this is a webview, so the
// menu is ours and it can say which option is on.
const MenuChoiceItem = <Id extends string>({
  option,
  active,
  onChoose
}: MenuChoiceItemProps<Id>) => (
  <button
    type="button"
    role="menuitemradio"
    aria-checked={active}
    onClick={() => onChoose(option.id)}
    className="flex cursor-pointer items-start gap-1.5 rounded px-1.5 py-1 text-left transition-colors hover:bg-accent"
  >
    <Check
      className={`mt-0.5 size-3.5 shrink-0 ${active ? 'text-foreground' : 'text-transparent'}`}
    />
    <span className="flex flex-col gap-0.5">
      <span className={active ? 'text-foreground' : ''}>{option.label}</span>
      <span className="text-muted-foreground">
        <CodeText text={option.hint} />
      </span>
    </span>
  </button>
);
