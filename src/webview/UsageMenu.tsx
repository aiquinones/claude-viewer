import { Check, MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SettingSource } from '../model/settings/settings';
import { UsageCostBasis, USAGE_COST_BASES } from '../model/usage/types';
import { useOpenSettings, useSettings, useSetUsage } from './settings/SettingsContext';

interface CostBasisOption {
  label: string;
  hint: string;
}

// The two readings of what a Claude turn cost. `all` is the invoice; `output` is what the model
// wrote, which is also how Claude Code weights a skill's share of your usage — and it leaves out the
// context re-reads that make the full figure look wrong beside a token count.
//
// A `Record` over the union, so a third basis is a type error here rather than an option the menu
// silently can't reach.
const COST_BASIS_OPTIONS: Record<UsageCostBasis, CostBasisOption> = {
  all: {
    label: 'Input + output',
    hint: 'What the API charges.'
  },
  output: {
    label: 'Output only',
    hint: 'Claude Code seems to only consider this.'
  }
};

// Where the setting came from, said in the menu rather than only in the Settings UI — the same
// reason the budgets card names its source.
const SOURCE_NOTE: Record<SettingSource, string> = {
  workspace: 'set for this workspace',
  user: 'set by you',
  default: 'the default'
};

interface UsageMenuProps {
  // Where the trigger sits in the row that holds it. The menu positions itself against the trigger,
  // so the caller only ever places the button.
  className?: string;
}

// The `...` in the metrics header: settings that change the numbers rather than which number is
// shown, so they don't belong on a toggle you flip while reading. It sits beside the figures it
// changes and renders under either metric — the cost basis is still the setting it is in Tokens
// mode, and this is also the way to the rest of the usage settings.
//
// Click to open, not hover — a hover menu you can click through closes under the pointer on the way
// to an item.
export const UsageMenu = ({ className = '' }: UsageMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const root = useRef<HTMLSpanElement>(null);
  const { costBasis } = useSettings().usage;
  const setUsage = useSetUsage();
  const openSettings = useOpenSettings();

  // Stable, so the listeners below are bound once per open rather than on every render.
  const close = useCallback((): void => setOpen(false), []);

  useDismiss({ root, open, onDismiss: close });

  const choose = (basis: UsageCostBasis): void => {
    setUsage({ costBasis: basis });
    setOpen(false);
  };

  return (
    <span ref={root} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">how cost is calculated</span>
      </button>

      {open && (
        <div
          role="menu"
          // Down and to the left: the trigger is at the top-right of the summary card, so a menu
          // opening upward would leave the panel and one opening rightward would run off its edge.
          className="absolute right-0 top-full z-30 mt-1.5 flex w-max max-w-[min(24rem,calc(100vw-3rem))] flex-col gap-1 rounded-md border border-border bg-popover p-1.5 text-xs shadow-lg"
        >
          <div className="flex items-baseline gap-2 px-1.5 pt-0.5 text-muted-foreground">
            <span>Claude cost calculated from</span>
            <span className="ml-auto shrink-0 text-[0.6875rem]">
              {SOURCE_NOTE[costBasis.source]}
            </span>
          </div>

          {USAGE_COST_BASES.map((basis) => (
            <BasisItem
              key={basis}
              basis={basis}
              option={COST_BASIS_OPTIONS[basis]}
              active={basis === costBasis.value}
              onChoose={choose}
            />
          ))}

          <div className="mt-0.5 border-t border-border pt-1">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 pl-1.5 text-xs"
              onClick={() => {
                setOpen(false);
                openSettings('usage');
              }}
            >
              <SlidersHorizontal className="size-3.5" />
              All usage settings
            </Button>
          </div>
        </div>
      )}
    </span>
  );
};

interface BasisItemProps {
  basis: UsageCostBasis;
  option: CostBasisOption;
  active: boolean;
  onChoose: (basis: UsageCostBasis) => void;
}

// A check on the active one, which a contributed VS Code menu can't do — this is a webview, so the
// menu is ours and it can say which option is on.
const BasisItem = ({ basis, option, active, onChoose }: BasisItemProps) => (
  <button
    type="button"
    role="menuitemradio"
    aria-checked={active}
    onClick={() => onChoose(basis)}
    className="flex cursor-pointer items-start gap-1.5 rounded px-1.5 py-1 text-left transition-colors hover:bg-accent"
  >
    <Check
      className={`mt-0.5 size-3.5 shrink-0 ${active ? 'text-foreground' : 'text-transparent'}`}
    />
    <span className="flex flex-col gap-0.5">
      <span className={active ? 'text-foreground' : ''}>{option.label}</span>
      <span className="text-muted-foreground">{option.hint}</span>
    </span>
  </button>
);

interface UseDismissArgs {
  root: { current: HTMLElement | null };
  open: boolean;
  onDismiss: () => void;
}

// Closes on escape or on a press outside. `pointerdown` rather than `click`, so a press that starts
// outside and releases inside doesn't leave the menu open behind the thing you meant to hit.
const useDismiss = ({ root, open, onDismiss }: UseDismissArgs): void => {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent): void => {
      if (!root.current?.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onDismiss, root]);
};
