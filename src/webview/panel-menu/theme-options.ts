// What the theme group in the panel's `...` offers. Two of the three have no palette behind them
// yet, so they carry `soon` and picking one reports rather than writes — see model/settings/theme.ts
// for which modes a setting may actually hold.

import { isPanelTheme, THEME_MODES, ThemeMode } from '../../model/settings/theme';
import { ChoiceOption } from '../menu/choice-option';

const THEME_HINT: Record<ThemeMode, string> = {
  inherit: "Follow the editor's color theme, which is what the panel has always done.",
  dark: 'A dark palette of the panel\'s own, whatever the editor is set to.',
  light: "A light palette of the panel's own, whatever the editor is set to."
};

export const THEME_LABEL: Record<ThemeMode, string> = {
  inherit: 'Inherit from editor',
  dark: 'Dark',
  light: 'Light'
};

export const THEME_OPTIONS: readonly ChoiceOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  id: mode,
  label: THEME_LABEL[mode],
  hint: THEME_HINT[mode],
  soon: !isPanelTheme(mode)
}));

// What the host is asked to say isn't built. "Dark theme", not "Dark" — the sentence the host writes
// reads as a name, and the label alone would leave it saying that Dark isn't built.
export const themeTitle = (mode: ThemeMode): string => `${THEME_LABEL[mode]} theme`;
