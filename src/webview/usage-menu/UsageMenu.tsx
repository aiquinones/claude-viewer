import { MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOpenSettings, useSettings, useSetUsage } from '../settings/SettingsContext';
import { COST_BASIS_OPTIONS, METRIC_OPTIONS, SCOPE_OPTIONS } from '../usage-options';
import { Z } from '../z-layers';
import { MenuChoice } from './MenuChoice';
import { useDismiss } from './useDismiss';

// The settings this menu can offer, in the order it draws them.
//
// Deliberately not annotated: a type here would erase the literals `UsageMenuSection` derives from.
export const USAGE_MENU_SECTIONS = ['metric', 'scope', 'costBasis'] as const;

export type UsageMenuSection = (typeof USAGE_MENU_SECTIONS)[number];

interface UsageMenuProps {
  // Where the trigger sits in the row that holds it. The menu positions itself against the trigger,
  // so the caller only ever places the button.
  className?: string;
  // Which settings this menu is for. All three on the usage surface. The session analysis page drops
  // the scope — you are looking at one session, and it is in whatever folder it is in — and drops
  // the Claude cost basis on a Copilot session, which bills in AIU and is priced by nothing here.
  sections?: readonly UsageMenuSection[];
}

// The `...` in the usage header: every setting the surface reads, in the corner beside the figures
// they change. All three are settings rather than component state — which number you're reading is
// part of how you read the surface, and it should still be that number tomorrow — so none of them
// belongs on a toggle sitting in the way of the thing being read.
//
// Click to open, not hover — a hover menu you can click through closes under the pointer on the way
// to an item. Picking an option closes it, so the numbers behind it are never covered by the control
// that changed them.
export const UsageMenu = ({ className = '', sections = USAGE_MENU_SECTIONS }: UsageMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const root = useRef<HTMLSpanElement>(null);
  const { metric, scope, costBasis } = useSettings().usage;
  const setUsage = useSetUsage();
  const openSettings = useOpenSettings();

  // Stable, so the listeners behind it are bound once per open rather than on every render.
  const close = useCallback((): void => setOpen(false), []);

  useDismiss({ root, open, onDismiss: close });

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
        <span className="sr-only">usage options</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Usage options"
          // Down and to the left: the trigger is at the top-right of the header, so a menu opening
          // upward would leave the panel and one opening rightward would run off its edge.
          style={{ zIndex: Z.card }}
          className="absolute right-0 top-full mt-1.5 flex w-max max-w-[min(24rem,calc(100vw-3rem))] flex-col divide-y divide-border rounded-md border border-border bg-popover p-1.5 text-xs shadow-lg"
        >
          {sections.includes('metric') && (
            <MenuChoice
              label="Metric"
              options={METRIC_OPTIONS}
              value={metric.value}
              source={metric.source}
              onChoose={(next) => {
                setUsage({ metric: next });
                close();
              }}
            />
          )}
          {sections.includes('scope') && (
            <MenuChoice
              label="Sessions"
              options={SCOPE_OPTIONS}
              value={scope.value}
              source={scope.source}
              onChoose={(next) => {
                setUsage({ scope: next });
                close();
              }}
            />
          )}
          {sections.includes('costBasis') && (
            <MenuChoice
              label="Claude cost calculated from"
              options={COST_BASIS_OPTIONS}
              value={costBasis.value}
              source={costBasis.source}
              onChoose={(next) => {
                setUsage({ costBasis: next });
                close();
              }}
            />
          )}

          <div className="pt-1.5">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 pl-1.5 text-xs"
              onClick={() => {
                close();
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
