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
export const ViewModeToggle = <Id extends string>({
  modes,
  mode,
  blockers,
  onChange
}: ViewModeToggleProps<Id>) => (
  <div
    role="group"
    aria-label="View as"
    style={{ '--mode-index': modes.findIndex((entry) => entry.id === mode) } as CSSProperties}
    className="relative flex shrink-0 items-center rounded-lg border border-border bg-muted p-1"
  >
    {/* The moving part: one button-sized tile that slides to whichever mode is on. Every button is
        the same width, so where it goes is its index — nothing has to be measured. */}
    <span aria-hidden className="mode-indicator absolute left-1 top-1 size-7 rounded-md bg-background shadow-sm" />
    {modes.map((entry) => (
      <ModeButton
        key={entry.id}
        entry={entry}
        active={entry.id === mode}
        blocker={blockerFor({ entry, blockers })}
        onChange={onChange}
      />
    ))}
  </div>
);

interface BlockerForArgs<Id extends string> {
  entry: ViewModeEntry<Id>;
  blockers: ModeBlockers<Id> | undefined;
}

// A `soon` mode carries its own reason — the caller shouldn't have to know which ones aren't built.
const blockerFor = <Id extends string>({
  entry,
  blockers
}: BlockerForArgs<Id>): string | undefined =>
  entry.status === 'soon' ? `${entry.label} view is coming` : blockers?.[entry.id];

interface ModeButtonProps<Id extends string> {
  entry: ViewModeEntry<Id>;
  active: boolean;
  blocker: string | undefined;
  onChange: (mode: Id) => void;
}

// Blocked buttons keep their hover so the tooltip can explain them — which is the whole point of
// dimming rather than hiding. `disabled` would kill the pointer events and the explanation with it.
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
