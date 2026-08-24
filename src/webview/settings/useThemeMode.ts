import { useEffect } from 'react';
import { ThemeMode } from '../../model/settings/theme';

// The whole JavaScript half of the theme feature: put the picked mode on the body, where the
// palette rules in styles.css can see it beside the `vscode-dark` / `vscode-light` class VS Code
// puts there. `auto` resolving to one palette or the other is a CSS selector, so nothing here reads
// the editor's polarity and nothing has to re-render when it changes.
export const useThemeMode = (mode: ThemeMode): void => {
  useEffect(() => {
    document.body.dataset.panelTheme = mode;
  }, [mode]);
};
