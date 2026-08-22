import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuButton } from '../menu/MenuButton';
import { MenuChoice } from '../menu/MenuChoice';
import { useOpenSettings, useSetTheme, useSettings } from '../settings/SettingsContext';
import { THEME_OPTIONS } from './theme-options';

// The `...` every view's header ends with, after the magnifier and the refresh. It holds what
// changes how the *panel* looks rather than what any one surface shows, which is why it's in the
// header row and says the same thing on every surface.
//
// One group so far. It's a menu rather than a segmented control because two of the three modes
// aren't built — a dimmed row is how you learn a mode is coming, where a dimmed tile is a control
// with a dead third of it.
export const PanelMenu = () => {
  const { mode } = useSettings().theme;
  const setTheme = useSetTheme();
  const openSettings = useOpenSettings();

  return (
    <MenuButton label="Panel options">
      {(close) => (
        <>
          <MenuChoice
            label="Theme"
            options={THEME_OPTIONS}
            value={mode.value}
            source={mode.source}
            onChoose={(next) => {
              setTheme(next);
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
                openSettings('theme');
              }}
            >
              <SlidersHorizontal className="size-3.5" />
              All theme settings
            </Button>
          </div>
        </>
      )}
    </MenuButton>
  );
};
