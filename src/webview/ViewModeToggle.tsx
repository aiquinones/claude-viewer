import { CSSProperties } from 'react';
import { Tooltip } from './Tooltip';
import { ModeBlockers, ViewModeEntry } from './view-mode';

interface ViewModeToggleProps<Id extends string> {
  // The modes to draw, in the order they sit in the control. Passed in rather than imported, so one
  // toggle serves the skill Content section and the Active Agents surface.
  modes: readonly ViewModeEntry<Id>[];
  mode: Id;
  blockers?: ModeBlockers<Id>;
  onChange: (mode: Id) => void;
}

// A segmented control over whatever modes it's handed. A map rather than written-out buttons, so
// another mode is one entry in the caller's list and nothing here.
//
// A `soon` mode isn't drawn at all, and a control left with one mode isn't either — a segmented
// control with nothing to segment is a decoration. So turning a mode on is still one field in the
// caller's list, and turning the last one off takes the whole control off the header with it.
export const ViewModeToggle = <Id extends string>({
  modes,
  mode,
  blockers,
  onChange
}: ViewModeToggleProps<Id>) => {
  const shown: readonly ViewModeEntry<Id>[] = modes.filter((entry) => entry.status !== 'soon');
  if (shown.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="View as"
      style={{ '--mode-index': shown.findIndex((entry) => entry.id === mode) } as CSSProperties}
      className="relative flex shrink-0 items-center rounded-lg border border-border bg-muted p-1"
    >
      {/* The moving part: one button-sized tile that slides to whichever mode is on. Every button
          is the same width, so where it goes is its index — nothing has to be measured. */}
      <span aria-hidden className="mode-indicator absolute left-1 top-1 size-7 rounded-md bg-background shadow-sm" />
      {shown.map((entry) => (
        <ModeButton
          key={entry.id}
          entry={entry}
          active={entry.id === mode}
          blocker={blockers?.[entry.id]}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

interface ModeButtonProps<Id extends string> {
  entry: ViewModeEntry<Id>;
  active: boolean;
  blocker: string | undefined;
  onChange: (mode: Id) => void;
}

// A blocker here is about what's on screen — a skill with no references has no graph to draw — so
// the button stays and dims, and keeps its hover so the tooltip can say why. That's the opposite
// call from a `soon` mode, which is missing rather than unavailable and isn't drawn at all.
// `disabled` would kill the pointer events and the explanation with them.
//
// `relative` on every button puts it over the tile sliding underneath.
const ModeButton = <Id extends string>({
  entry,
  active,
  blocker,
  onChange
}: ModeButtonProps<Id>) => {
  const Icon = entry.icon;

  return (
    <Tooltip label={blocker ?? entry.label}>
      <button
        type="button"
        aria-label={entry.label}
        aria-pressed={active}
        aria-disabled={Boolean(blocker)}
        onClick={() => !blocker && onChange(entry.id)}
        className={`relative flex size-7 items-center justify-center rounded-md transition-colors ${modeClass(
          { active, blocked: Boolean(blocker) }
        )}`}
      >
        <Icon className="size-4" />
      </button>
    </Tooltip>
  );
};

interface ModeClassArgs {
  active: boolean;
  blocked: boolean;
}

const modeClass = ({ active, blocked }: ModeClassArgs): string => {
  if (blocked) return 'cursor-default text-muted-foreground/40';
  if (active) return 'cursor-pointer text-foreground';
  return 'cursor-pointer text-muted-foreground hover:text-foreground';
};
