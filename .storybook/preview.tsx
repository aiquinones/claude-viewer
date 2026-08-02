import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/webview/styles.css';
import { applyTheme, ThemeName } from './vscode-theme';

// App reaches for the webview bridge at module scope, which doesn't exist outside the editor.
// Stubbing it here — before any story loads — lets the full panel render with its messages
// going nowhere.
(window as unknown as { acquireVsCodeApi: () => { postMessage: (message: unknown) => void } })
  .acquireVsCodeApi = () => ({ postMessage: () => undefined });

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
    controls: { matchers: { color: /(background|color)$/i } }
  }
};

export default preview;
