import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuButton } from '../menu/MenuButton';
import { MenuChoice } from '../menu/MenuChoice';
import { useOpenSettings, useSettings, useSetUsage } from '../settings/SettingsContext';
import { SCOPE_OPTIONS } from '../usage-options';

interface UsageMenuProps {
  // Where the trigger sits in the row that holds it. The menu positions itself against the trigger,
  // so the caller only ever places the button.
  className?: string;
}

// The `...` in the usage header: which sessions the surface counts, in the corner beside the figures
// it changes. A setting rather than component state — the scope is how you read the surface, and it
// should still be that scope tomorrow — so it doesn't belong on a toggle sitting in the way of the
// thing being read.
//
// Not the same `...` as the panel's, which sits in the header row above and changes how the panel
// looks on every surface. This one changes what the figure is a total of, and it stays in the block
// holding that figure. The session page has no such `...`: one session is in whatever folder it is
// in, so there is nothing here to ask it.
//
// Picking an option closes it, so the numbers behind it are never covered by the control that
// changed them.
export const UsageMenu = ({ className = '' }: UsageMenuProps) => {
  const { scope } = useSettings().usage;
  const setUsage = useSetUsage();
  const openSettings = useOpenSettings();

  return (
    <MenuButton label="Usage options" className={className}>
      {(close) => (
        <>
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
