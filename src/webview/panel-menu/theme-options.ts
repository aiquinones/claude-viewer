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

// Two rows both starting with "Editor" is what earns hints here. Dark and Light wouldn't need one —
// a sentence saying that Dark is dark is a line to read past — but they carry the half that isn't
// obvious: that they hold whatever the editor is doing.
const THEME_HINT: Record<ThemeMode, string> = {
  inherit: 'Every color read from your VS Code theme.',
  auto: "The panel's own palette, in the polarity your editor is in.",
  dark: "The panel's dark palette, whatever the editor is set to.",
  light: "The panel's light palette, whatever the editor is set to."
};

export const THEME_OPTIONS: readonly ChoiceOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  id: mode,
  label: THEME_LABEL[mode],
  hint: THEME_HINT[mode]
}));
