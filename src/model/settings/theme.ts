// Which palette the panel draws in. Today the answer is always the editor's — styles.css maps every
// token onto a `--vscode-*` variable — so `inherit` is the only mode a setting may hold, and the
// other two exist as menu rows that say they're coming.

// Every mode the menu offers, in the order it draws them.
//
// Deliberately not annotated: a type here would erase the literals `ThemeMode` derives from.
export const THEME_MODES = ['inherit', 'dark', 'light'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

// The subset a setting may hold. Narrower than `ThemeMode` on purpose: a mode with no palette
// behind it must not survive in someone's settings.json long after they forgot picking it.
//
// Shipping a palette means adding its mode here, dropping `soon` from its option, and adding it to
// the enum in package.json — those two lists are the same claim in two registries.
export const PANEL_THEMES = ['inherit'] as const satisfies readonly ThemeMode[];

export type PanelTheme = (typeof PANEL_THEMES)[number];

// The editor's own colors, which is what the panel has always drawn.
export const DEFAULT_PANEL_THEME: PanelTheme = 'inherit';

// Whether a mode the menu offers is one that can be set. The narrowing is what lets the click
// handler split into "write it" and "say it isn't built" without comparing strings.
export const isPanelTheme = (mode: ThemeMode): mode is PanelTheme =>
  (PANEL_THEMES as readonly ThemeMode[]).includes(mode);
