import { RefObject, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Z } from '../../z-layers';
import {
  NAMES_CAVEAT,
  NAMES_EMPTY,
  NAMES_PLACEHOLDER,
  NAMES_TITLE,
  mergeStageNames
} from './stage-names';

interface StageNamesDialogProps {
  // The skills that opened a stage in this session, in the order they first did. Only these are
  // listed — a stage you can't see on the radar behind the dialog isn't one you're renaming.
  skills: string[];
  // Every override that's stored, including ones for skills this session never ran. Seeds the
  // fields, and the ones not listed here ride through Save untouched.
  current: Record<string, string>;
  onSave: (names: Record<string, string>) => void;
  onDismiss: () => void;
}

// Renaming the stages of one session. It holds a draft: the fields move freely and nothing is
// written until Save, the same deal `EstimatorDialog` makes and for the same reason — these names
// are what the radars are labelled with, and a field being typed into shouldn't relabel a chart
// character by character.
export const StageNamesDialog = ({
  skills,
  current,
  onSave,
  onDismiss
}: StageNamesDialogProps) => {
  const [draft, setDraft] = useState<Record<string, string>>(() => seed({ skills, current }));
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);

  const changed: boolean = skills.some(
    (skill) => (draft[skill] ?? '').trim() !== (current[skill] ?? '')
  );

  // A draft that matches what's already stored writes nothing and still closes — Enter in a dialog
  // means "I'm done here" whether or not there was anything to save.
  const save = (): void =>
    changed ? onSave(mergeStageNames({ skills, current, draft })) : onDismiss();

  // Focus, once, on open. Its own effect with no dependencies — sharing the listener's below would
  // re-run it on every keystroke, and a `focus()` mid-typing takes the caret out of the field you
  // are typing into. Nothing announces itself: the character lands, and the next one goes nowhere.
  //
  // The first field rather than the box: this is a form, and the thing you opened it to do is type.
  // A session with no stages has no field, so the box takes it and Escape still has somewhere to
  // fire from.
  useEffect(() => {
    if (first.current) first.current.focus();
    else box.current?.focus();
  }, []);

  // On the window rather than the box, so Escape and Enter work from anywhere inside the dialog —
  // including from a field, where Enter is what saves a form.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        return onDismiss();
      }
      if (event.key !== 'Enter') return;
      // A focused button answers Enter by firing its own click, and handling it here too would
      // save twice.
      if (event.target instanceof HTMLElement && event.target.closest('button')) return;

      event.preventDefault();
      save();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onDismiss, onSave, draft, changed]);

  return (
    <div
      style={{ zIndex: Z.overlay }}
      className="fixed inset-0 flex justify-center bg-scrim px-4 pt-[12vh]"
      onMouseDown={onDismiss}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        className="flat-focus flex h-fit max-h-[70vh] w-full max-w-md flex-col overflow-clip rounded-xl border border-border bg-popover shadow-2xl outline-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start gap-3 border-b border-border px-4 py-3">
          <div className="mr-auto flex flex-col gap-1">
            <h2 id={TITLE_ID} className="text-sm font-semibold">
              {NAMES_TITLE}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{NAMES_CAVEAT}</p>
          </div>
          <Button variant="ghost" size="icon" title="Close" onClick={onDismiss}>
            <X />
          </Button>
        </header>

        {/* The list is as tall as its stages and scrolls once the dialog hits its cap. No `flex-1`:
            that would stretch four fields over the whole 70vh and leave Save adrift under a field
            of nothing. */}
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-4 py-3">
          {skills.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{NAMES_EMPTY}</p>
          ) : (
            skills.map((skill, index) => (
              <StageNameField
                key={skill}
                skill={skill}
                value={draft[skill] ?? ''}
                inputRef={index === 0 ? first : undefined}
                onChange={(name) => setDraft((held) => ({ ...held, [skill]: name }))}
              />
            ))
          )}
        </div>

        <footer className="flex justify-end border-t border-border px-4 py-3">
          {/* Grey rather than a faded accent while there's nothing to save — the same treatment the
              estimator's Apply needed, and for the same reason: it's off most of the time it's on
              screen. */}
          <Button
            size="sm"
            disabled={!changed}
            onClick={save}
            className="disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          >
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
};

const TITLE_ID: string = 'stage-names-dialog-title';

interface SeedArgs {
  skills: string[];
  current: Record<string, string>;
}

// The fields as the dialog opens: whatever is stored for each stage, or empty. Empty is what draws
// the placeholder, which is how a field says it isn't overriding anything.
const seed = ({ skills, current }: SeedArgs): Record<string, string> =>
  Object.fromEntries(skills.map((skill) => [skill, current[skill] ?? '']));

interface StageNameFieldProps {
  skill: string;
  value: string;
  // Set on the first field only, so the dialog can put the caret there on open.
  inputRef?: RefObject<HTMLInputElement>;
  onChange: (name: string) => void;
}

// One stage: the skill that opened it, and what to call it instead. The skill name stays on screen
// while you type over it — it's what the override is keyed on, and a row that only showed the new
// name would stop saying which stage you were renaming.
const StageNameField = ({ skill, value, inputRef, onChange }: StageNameFieldProps) => (
  <label className="flex items-center gap-3 text-sm">
    <span className="mono w-36 shrink-0 truncate text-xs text-muted-foreground" title={skill}>
      /{skill}
    </span>
    {/* `flat-focus`: VS Code injects an unlayered `input:focus { outline }` into every webview, and
        no utility outranks it — see the gotcha the spotlight input hit. */}
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder={NAMES_PLACEHOLDER}
      onChange={(event) => onChange(event.target.value)}
      className="flat-focus min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
    />
  </label>
);
