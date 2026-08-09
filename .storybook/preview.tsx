import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/webview/styles.css';
import { skillMarkdown } from '../src/webview/fixtures';
import { applyTheme, ThemeName } from './vscode-theme';

// App reaches for the webview bridge at module scope, which doesn't exist outside the editor.
// Stubbing it here — before any story loads — lets the full panel render with its messages going
// nowhere. The exception is `requestBody`: nothing answering it leaves the skills surface sitting
// on "Reading…", so the stub plays host and posts a fixture back.
(window as unknown as { acquireVsCodeApi: () => { postMessage: (message: unknown) => void } })
  .acquireVsCodeApi = () => ({
  postMessage: (message: unknown) => {
    const request = message as { type?: string; path?: string };
    if (request?.type !== 'requestBody') return;
    window.postMessage({ type: 'skillBody', path: request.path, body: skillMarkdown }, '*');
  }
});

const withVsCodeTheme: Decorator = (Story, context) => {
  const theme: ThemeName = context.globals.theme === 'light' ? 'light' : 'dark';
  useEffect(() => applyTheme(theme), [theme]);
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
    }
  },
  initialGlobals: { theme: 'dark' },
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
