import { RefObject, useId } from 'react';
import { CornerDownLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAMES_PLACEHOLDER, NOT_A_STAGE, USE_SKILL_NAME } from './stage-names';

interface StageNameFieldProps {
  skill: string;
  value: string;
  // Set on the first field only, so the dialog can put the caret there on open.
  inputRef?: RefObject<HTMLInputElement>;
  onChange: (name: string) => void;
  // The row button: fill a blank field with the skill's name, or clear one that has a name.
  onToggle: () => void;
}

// One skill: what it's called, and whether it's a stage at all. The skill name stays on screen while
// you type over it — it's what the name is keyed on, and a row that only showed the new name would
// stop saying which skill you were naming.
export const StageNameField = ({
  skill,
  value,
  inputRef,
  onChange,
  onToggle
}: StageNameFieldProps) => {
  const fieldId: string = useId();
  const named: boolean = value.trim().length > 0;
  const action: string = named ? NOT_A_STAGE : USE_SKILL_NAME;

  // Not a `<label>` any more: the row holds a button as well as the field, and a button inside a
  // label is clicked twice — its own handler, then the label forwarding the click to the input.
  return (
    <div className="flex items-center gap-3 text-sm">
      <label
        className="mono w-36 shrink-0 truncate text-xs text-muted-foreground"
        htmlFor={fieldId}
        title={skill}
      >
        /{skill}
      </label>
      {/* `flat-focus`: VS Code injects an unlayered `input:focus { outline }` into every webview, and
          no utility outranks it — see the gotcha the spotlight input hit. */}
      <input
        id={fieldId}
        ref={inputRef}
        type="text"
        value={value}
        placeholder={NAMES_PLACEHOLDER}
        onChange={(event) => onChange(event.target.value)}
        className="flat-focus min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      {/* A `title` rather than `Tooltip`: the list scrolls, and a bubble hung under the last row
          is clipped by the box it scrolls in. The dialog's own Close button does the same. */}
      <Button
        variant="ghost"
        size="icon"
        title={action}
        className="size-7 shrink-0"
        onClick={onToggle}
      >
        {named ? <X className="size-3.5" /> : <CornerDownLeft className="size-3.5" />}
      </Button>
    </div>
  );
};
