// What the theme group in the panel's `...` offers. Two of the three have no palette behind them
// yet, so they carry `soon` and picking one reports rather than writes — see model/settings/theme.ts
// for which modes a setting may actually hold.
//
// No hints: the usage options are two readings of one number and a label alone can't separate them,
// where Dark is a dark theme and a sentence saying so is a line to read past.

import { isPanelTheme, THEME_MODES, ThemeMode } from '../../model/settings/theme';
import { ChoiceOption } from '../menu/choice-option';

export const THEME_LABEL: Record<ThemeMode, string> = {
  inherit: 'Inherit from editor',
  dark: 'Dark',
  light: 'Light'
};

export const THEME_OPTIONS: readonly ChoiceOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  id: mode,
  label: THEME_LABEL[mode],
  soon: !isPanelTheme(mode)
}));

// What the host is asked to say isn't built. "Dark theme", not "Dark" — the sentence the host writes
// reads as a name, and the label alone would leave it saying that Dark isn't built.
export const themeTitle = (mode: ThemeMode): string => `${THEME_LABEL[mode]} theme`;
