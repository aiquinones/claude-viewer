import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

// Storybook brings its own Vite; the extension itself still builds with esbuild via build.mjs.
// The only things Vite has to be told are the two aliases and how to compile Tailwind v4:
// `@/` is the webview's own convention, and `@src/` is how everything under `stories/` reaches
// back into the app it renders.
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // The extension makes no network calls by design; the tooling around it shouldn't either.
  core: { disableTelemetry: true },
  viteFinal: async (vite) => {
    vite.plugins = [...(vite.plugins ?? []), tailwindcss()];
    vite.resolve = {
      ...vite.resolve,
      alias: {
        ...(vite.resolve?.alias as Record<string, string> | undefined),
        '@': fileURLToPath(new URL('../src/webview', import.meta.url)),
        '@src': fileURLToPath(new URL('../src', import.meta.url))
      }
    };
    return vite;
  }
};

export default config;
