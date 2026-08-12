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

// The segmented control in the Content heading. A map over VIEW_MODES rather than three written-out
// buttons, so a fourth mode is one entry there and nothing here.
export const ViewModeToggle = ({ mode, blockers, onChange }: ViewModeToggleProps) => (
  <div role="group" aria-label="View as" className="flex items-center gap-px rounded-md bg-muted p-px">
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
        className={`flex size-5 items-center justify-center rounded-[0.3rem] transition-colors ${modeClass(
          { active, blocked: Boolean(blocker) }
        )}`}
      >
        <Icon className="size-3.5" />
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
  if (active) return 'cursor-pointer bg-background text-foreground shadow-sm';
  return 'cursor-pointer text-muted-foreground hover:text-foreground';
};
