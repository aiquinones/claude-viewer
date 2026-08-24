import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/webview/styles.css';
import {
  memoryIndexMarkdown,
  memoryMarkdown,
  promptMarkdown,
  skillMarkdown
} from '../stories/fixtures';
import { DEFAULT_THEME_MODE, THEME_MODES, ThemeMode } from '../src/model/settings/theme';
import { applyTheme, ThemeName } from './vscode-theme';

// App reaches for the webview bridge at module scope, which doesn't exist outside the editor.
// Stubbing it here — before any story loads — lets the full panel render with its messages going
// nowhere. The exception is `requestBody`: nothing answering it leaves a selected file sitting on
// "Reading…", so the stub plays host and posts a fixture back.
//
// Which fixture follows the same split the host makes: a SKILL.md and a memory come back below
// their frontmatter, anything else — a CLAUDE.md, and MEMORY.md — comes back whole.
(window as unknown as { acquireVsCodeApi: () => { postMessage: (message: unknown) => void } })
  .acquireVsCodeApi = () => ({
  postMessage: (message: unknown) => {
    const request = message as { type?: string; path?: string };
    if (request?.type !== 'requestBody') return;

    const body: string = bodyFor(request.path ?? '');
    window.postMessage({ type: 'fileBody', path: request.path, body }, '*');
  }
});

const bodyFor = (path: string): string => {
  if (path.endsWith('SKILL.md')) return skillMarkdown;
  // Before the directory check: MEMORY.md lives in there too, and it is an index, not a memory.
  if (path.endsWith('MEMORY.md')) return memoryIndexMarkdown;
  if (path.includes('/memory/')) return memoryMarkdown;
  return promptMarkdown;
};

const isThemeMode = (value: unknown): value is ThemeMode =>
  (THEME_MODES as readonly string[]).includes(value as string);

// Two toolbars rather than one, because `auto` needs both halves: which editor theme is simulated,
// and which palette the panel is set to. Panel dark on Light+ is a real state to look at.
const withVsCodeTheme: Decorator = (Story, context) => {
  const theme: ThemeName = context.globals.theme === 'light' ? 'light' : 'dark';
  const panel: ThemeMode = isThemeMode(context.globals.panel)
    ? context.globals.panel
    : DEFAULT_THEME_MODE;

  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => {
    document.body.dataset.panelTheme = panel;
  }, [panel]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withVsCodeTheme],
  globalTypes: {
    theme: {
      description: 'Simulated editor theme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark+' },
          { value: 'light', title: 'Light+' }
        ],
        dynamicTitle: true
      }
    },
    panel: {
      description: 'Panel palette',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'auto', title: 'Auto' },
          { value: 'dark', title: 'Panel dark' },
          { value: 'light', title: 'Panel light' },
          { value: 'inherit', title: "Editor's color" }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: { theme: 'dark', panel: 'auto' },
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
    // The panel's responsive rules are media queries, and a story iframe's viewport is the only
    // thing those read — a narrow decorator won't trigger them. These are the two panel widths
    // worth looking at: one editor group beside another, and the panel on its own.
    viewport: {
      options: {
        narrowPanel: { name: 'Narrow panel', styles: { width: '520px', height: '900px' } },
        widePanel: { name: 'Wide panel', styles: { width: '1100px', height: '900px' } }
      }
    }
  }
};

export default preview;
