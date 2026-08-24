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

// The editor's own colors, which is what the panel has always drawn — so an existing settings.json
// keeps meaning what it meant.
export const DEFAULT_THEME_MODE: ThemeMode = 'inherit';
