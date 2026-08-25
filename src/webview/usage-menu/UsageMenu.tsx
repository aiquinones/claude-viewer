import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuButton } from '../menu/MenuButton';
import { MenuChoice } from '../menu/MenuChoice';
import { useOpenSettings, useSettings, useSetUsage } from '../settings/SettingsContext';
import { METRIC_OPTIONS, SCOPE_OPTIONS } from '../usage-options';

// The settings this menu can offer, in the order it draws them.
//
// Deliberately not annotated: a type here would erase the literals `UsageMenuSection` derives from.
export const USAGE_MENU_SECTIONS = ['metric', 'scope'] as const;

export type UsageMenuSection = (typeof USAGE_MENU_SECTIONS)[number];

interface UsageMenuProps {
  // Where the trigger sits in the row that holds it. The menu positions itself against the trigger,
  // so the caller only ever places the button.
  className?: string;
  // Which settings this menu is for. Both on the usage surface. The session analysis page drops the
  // scope — you are looking at one session, and it is in whatever folder it is in.
  sections?: readonly UsageMenuSection[];
}

// The `...` in the usage header: every setting the surface reads, in the corner beside the figures
// they change. Both are settings rather than component state — which number you're reading is
// part of how you read the surface, and it should still be that number tomorrow — so none of them
// belongs on a toggle sitting in the way of the thing being read.
//
// Not the same `...` as the panel's, which sits in the header row above and changes how the panel
// looks on every surface. This one changes which number you're reading, and it stays in the block
// holding that number.
//
// Picking an option closes it, so the numbers behind it are never covered by the control that
// changed them.
export const UsageMenu = ({ className = '', sections = USAGE_MENU_SECTIONS }: UsageMenuProps) => {
  const { metric, scope } = useSettings().usage;
  const setUsage = useSetUsage();
  const openSettings = useOpenSettings();

  return (
    <MenuButton label="Usage options" className={className}>
      {(close) => (
        <>
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
        </>
      )}
    </MenuButton>
  );
};
