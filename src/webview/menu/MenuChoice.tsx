import { Check } from 'lucide-react';
import { SettingSource } from '../../model/settings/settings';
import { CodeText } from '../CodeText';
import { ChoiceOption } from './choice-option';

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
  // Where the value came from, printed beside the group's label. Optional: it's there because a
  // *number* you can't argue with is a number you ignore, which is the usage menu's whole problem
  // and no problem at all for a theme — nobody wonders which layer set what color they're looking
  // at. Left out, the label has the row to itself.
  source?: SettingSource;
  onChoose: (value: Id) => void;
}

// One setting inside the `...`, as a group of radio rows. The same `ChoiceOption` a segmented
// control draws, except the hint is under the label rather than on hover: a menu is already open, so
// there's nothing to reveal. An option with no hint is its label alone.
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
      {source && <span className="ml-auto shrink-0 text-[0.6875rem]">{SOURCE_NOTE[source]}</span>}
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
//
// A `soon` row dims and still fires: it can't be the active one, so nothing here shows it as picked,
// and what the click means is the parent's to decide.
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
    className={`flex cursor-pointer items-start gap-1.5 rounded px-1.5 py-1 text-left transition-colors hover:bg-accent ${
      option.soon ? 'opacity-50' : ''
    }`}
  >
    <Check
      className={`mt-0.5 size-3.5 shrink-0 ${active ? 'text-foreground' : 'text-transparent'}`}
    />
    <span className="flex flex-col gap-0.5">
      <span className="flex items-baseline gap-1.5">
        <span className={active ? 'text-foreground' : ''}>{option.label}</span>
        {option.soon && <span className="text-[0.6875rem] text-muted-foreground">soon</span>}
      </span>
      {option.hint && (
        <span className="text-muted-foreground">
          <CodeText text={option.hint} />
        </span>
      )}
    </span>
  </button>
);
