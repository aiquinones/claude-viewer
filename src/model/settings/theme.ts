// Which palette the panel draws in. Four answers: read every color from the editor, read only
// whether it's light or dark, or take one of the panel's own palettes outright.
//
// The polarity read is a CSS selector rather than anything here — a webview's <body> carries
// `vscode-light` / `vscode-dark`, so `auto` is a rule in styles.css and this file only names it.

// Every mode, in the order the menu draws them: increasing specificity, from inheriting everything
// to inheriting nothing.
//
// Deliberately not annotated: a type here would erase the literals `ThemeMode` derives from.
export const THEME_MODES = ['inherit', 'auto', 'dark', 'light'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

// The panel's own palette, in whichever polarity the editor is in. Not `inherit`, which is what
// shipped before the palettes existed: a panel that reads every color off the active theme looks
// like whatever that theme happens to do to a widget, and the palettes are here because that's
// worth deciding rather than inheriting. Following the editor's light/dark is the part of the
// inheritance that's always right.
export const DEFAULT_THEME_MODE: ThemeMode = 'auto';
