// What the theme group in the panel's `...` offers. Three palettes and then the mode that gives the
// palette up — see model/settings/theme.ts for that ordering, and styles.css for where `auto` is
// decided.

import { THEME_MODES, ThemeMode } from '../../model/settings/theme';
import { ChoiceOption } from '../menu/choice-option';

export const THEME_LABEL: Record<ThemeMode, string> = {
  auto: 'Auto',
  dark: 'Dark',
  light: 'Light',
  inherit: "Editor's color"
};

// One hint, on the one row that isn't a palette. Auto, Dark and Light are three answers to the same
// question and their labels are the whole answer; the last row is answering a different question,
// and what a label can't say is that it's *every* color — the panel stops having a palette at all.
const THEME_HINT: Partial<Record<ThemeMode, string>> = {
  inherit: 'Use every color from the active theme'
};

export const THEME_OPTIONS: readonly ChoiceOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  id: mode,
  label: THEME_LABEL[mode],
  hint: THEME_HINT[mode]
}));
