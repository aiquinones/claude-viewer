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
// One group so far. A menu rather than a segmented control because one of the rows carries a
// sentence, and four tiles with a hint under one of them is not a control.
//
// No provenance line, unlike the usage menu: which layer set a color is not a thing anyone wonders,
// where which layer set a *limit* is the whole reason that line exists.
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
