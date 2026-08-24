// What the theme group in the panel's `...` offers. Four modes, drawn from inheriting everything to
// inheriting nothing — see model/settings/theme.ts, and styles.css for where `auto` is decided.

import { THEME_MODES, ThemeMode } from '../../model/settings/theme';
import { ChoiceOption } from '../menu/choice-option';

export const THEME_LABEL: Record<ThemeMode, string> = {
  inherit: 'Editor colors',
  auto: 'Editor light/dark',
  dark: 'Dark',
  light: 'Light'
};

// Only the two rows that both start with "Editor" get one — they're the pair a label can't separate.
// Dark and Light say what they are, and a sentence repeating it is a line to read past.
const THEME_HINT: Partial<Record<ThemeMode, string>> = {
  inherit: 'Use active theme',
  auto: "Use active's theme polarity"
};

export const THEME_OPTIONS: readonly ChoiceOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  id: mode,
  label: THEME_LABEL[mode],
  hint: THEME_HINT[mode]
}));
