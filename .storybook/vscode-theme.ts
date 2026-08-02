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
  '--vscode-editorError-foreground': '#f14c4c'
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
  '--vscode-editorError-foreground': '#e51400'
};

const THEMES: Record<ThemeName, Record<string, string>> = { dark: DARK, light: LIGHT };

// Has to be applied to :root. styles.css computes --background and friends there, so a variable
// set on a wrapper element would come too late to be seen.
export const applyTheme = (theme: ThemeName): void => {
  const root: HTMLElement = document.documentElement;
  for (const [name, value] of Object.entries(THEMES[theme])) {
    root.style.setProperty(name, value);
  }
  document.body.style.background = THEMES[theme]['--vscode-editor-background'];
};
