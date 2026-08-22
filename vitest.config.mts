import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Tests live under `tests/`, mirroring `src/` the way `stories/` does, and reach into the app
// through the same two aliases Storybook uses: `@/` is the webview's own, `@src/` is everything
// else. Node environment — nothing tested here touches a DOM.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/webview', import.meta.url)),
      '@src': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
});
