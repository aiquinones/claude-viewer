import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuButton } from '../menu/MenuButton';
import { MenuChoice } from '../menu/MenuChoice';
import { useOpenSettings, useSettings, useSetUsage } from '../settings/SettingsContext';
import { COST_BASIS_OPTIONS, METRIC_OPTIONS, SCOPE_OPTIONS } from '../usage-options';

interface UsageMenuProps {
  // Where the trigger sits in the row that holds it. The menu positions itself against the trigger,
  // so the caller only ever places the button.
  className?: string;
}

// The `...` in the usage header: every setting the surface reads, in the corner beside the figures
// they change. All three are settings rather than component state — which number you're reading is
// part of how you read the surface, and it should still be that number tomorrow — so none of them
// belongs on a toggle sitting in the way of the thing being read.
//
// Not the same `...` as the panel's, which sits in the header row above and changes how the panel
// looks on every surface. This one changes which number you're reading, and it stays in the block
// holding that number.
//
// Picking an option closes it, so the numbers behind it are never covered by the control that
// changed them.
export const UsageMenu = ({ className = '' }: UsageMenuProps) => {
  const { metric, scope, costBasis } = useSettings().usage;
  const setUsage = useSetUsage();
  const openSettings = useOpenSettings();

  return (
    <MenuButton label="Usage options" className={className}>
      {(close) => (
        <>
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
