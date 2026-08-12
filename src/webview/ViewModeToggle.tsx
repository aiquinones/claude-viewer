import { CSSProperties } from 'react';
import { Tooltip } from './Tooltip';
import { SkillViewMode, VIEW_MODES, ViewMode } from './view-modes';

// Why a mode can't be picked, keyed by mode. A mode with no entry here is available; the string is
// what its tooltip says instead of the label.
export type ModeBlockers = Partial<Record<SkillViewMode, string>>;

interface ViewModeToggleProps {
  mode: SkillViewMode;
  blockers?: ModeBlockers;
  onChange: (mode: SkillViewMode) => void;
}

// The segmented control above the Content heading. A map over VIEW_MODES rather than three
// written-out buttons, so a fourth mode is one entry there and nothing here.
export const ViewModeToggle = ({ mode, blockers, onChange }: ViewModeToggleProps) => (
  <div
    role="group"
    aria-label="View as"
    style={{ '--mode-index': VIEW_MODES.findIndex((entry) => entry.id === mode) } as CSSProperties}
    className="relative flex items-center rounded-lg border border-border bg-muted p-0.5"
  >
    {/* The moving part: one button-sized tile that slides to whichever mode is on. Every button is
        the same width, so where it goes is its index — nothing has to be measured. */}
    <span
      aria-hidden
      className="mode-indicator absolute left-0.5 top-0.5 size-6 rounded-md bg-background shadow-sm"
    />
    {VIEW_MODES.map((entry) => (
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

interface BlockerForArgs {
  entry: ViewMode;
  blockers: ModeBlockers | undefined;
}

// A `soon` mode carries its own reason — the caller shouldn't have to know which ones aren't built.
const blockerFor = ({ entry, blockers }: BlockerForArgs): string | undefined =>
  entry.status === 'soon' ? `${entry.label} view is coming` : blockers?.[entry.id];

interface ModeButtonProps {
  entry: ViewMode;
  active: boolean;
  blocker: string | undefined;
  onChange: (mode: SkillViewMode) => void;
}

// Blocked buttons keep their hover so the tooltip can explain them — which is the whole point of
// dimming rather than hiding. `disabled` would kill the pointer events and the explanation with it.
//
// `relative` on every button puts it over the tile sliding underneath.
const ModeButton = ({ entry, active, blocker, onChange }: ModeButtonProps) => {
  const Icon = entry.icon;

  return (
    <Tooltip label={blocker ?? entry.label}>
      <button
        type="button"
        aria-label={entry.label}
        aria-pressed={active}
        aria-disabled={Boolean(blocker)}
        onClick={() => !blocker && onChange(entry.id)}
        className={`relative flex size-6 items-center justify-center rounded-md transition-colors ${modeClass(
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
