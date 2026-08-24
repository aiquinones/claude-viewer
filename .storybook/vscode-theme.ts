// The --vscode-* variables the panel's tokens read, with values taken from the stock Dark+ and
// Light+ themes. In the real extension the editor injects these; here they're simulated, which is
// why Storybook shows whether the panel *can* follow a theme, not that it does. F5 is still the
// only proof of that.
export type ThemeName = 'dark' | 'light';

const DARK: Record<string, string> = {
  '--vscode-font-family': 'system-ui, -apple-system, sans-serif',
  '--vscode-editor-font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
  '--vscode-editor-background': '#1f1f1f',
  '--vscode-foreground': '#cccccc',
  '--vscode-editorWidget-background': '#252526',
  '--vscode-button-background': '#0078d4',
  '--vscode-button-foreground': '#ffffff',
  '--vscode-button-hoverBackground': '#026ec1',
  '--vscode-descriptionForeground': '#9d9d9d',
  '--vscode-list-hoverBackground': '#2a2d2e',
  '--vscode-list-activeSelectionBackground': '#04395e',
  '--vscode-list-activeSelectionForeground': '#ffffff',
  '--vscode-widget-border': '#303031',
  '--vscode-input-background': '#313131',
  '--vscode-focusBorder': '#0078d4',
  '--vscode-editorWarning-foreground': '#cca700',
  '--vscode-editorError-foreground': '#f14c4c',
  '--vscode-textLink-foreground': '#4daafc',
  // Surface-card accents.
  '--vscode-charts-blue': '#3794ff',
  '--vscode-charts-purple': '#b180d7'
};

const LIGHT: Record<string, string> = {
  '--vscode-font-family': 'system-ui, -apple-system, sans-serif',
  '--vscode-editor-font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
  '--vscode-editor-background': '#ffffff',
  '--vscode-foreground': '#3b3b3b',
  '--vscode-editorWidget-background': '#f8f8f8',
  '--vscode-button-background': '#005fb8',
  '--vscode-button-foreground': '#ffffff',
  '--vscode-button-hoverBackground': '#0258a8',
  '--vscode-descriptionForeground': '#767676',
  '--vscode-list-hoverBackground': '#e8e8e9',
  '--vscode-list-activeSelectionBackground': '#0060c0',
  '--vscode-list-activeSelectionForeground': '#ffffff',
  '--vscode-widget-border': '#e5e5e5',
  '--vscode-input-background': '#ffffff',
  '--vscode-focusBorder': '#005fb8',
  '--vscode-editorWarning-foreground': '#bf8803',
  '--vscode-editorError-foreground': '#e51400',
  '--vscode-textLink-foreground': '#005fb8',
  // Surface-card accents.
  '--vscode-charts-blue': '#1a85ff',
  '--vscode-charts-purple': '#652d90'
};

const THEMES: Record<ThemeName, Record<string, string>> = { dark: DARK, light: LIGHT };

// On :root, above the body where styles.css computes --background and friends from these — a
// variable set on a wrapper further down would come too late to be seen.
//
// The page's own background isn't set here: styles.css paints the body from --background, which is
// these values under `inherit` and the panel's own under any palette.
export const applyTheme = (theme: ThemeName): void => {
  const root: HTMLElement = document.documentElement;
  for (const [name, value] of Object.entries(THEMES[theme])) {
    root.style.setProperty(name, value);
  }
  // The class a real webview carries, which is the only thing the `auto` palette rules read.
  document.body.classList.toggle('vscode-dark', theme === 'dark');
  document.body.classList.toggle('vscode-light', theme === 'light');
};
