import * as esbuild from 'esbuild';
import { spawn } from 'node:child_process';

const watch = process.argv.includes('--watch');

// Host: runs in the extension (Node) — vscode is provided by the runtime.
const host = {
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18'
};

// Webview: the React app, bundled for the browser and loaded as a single nonce'd script.
// Watch mode keeps React's dev warnings; a one-off build ships the minified production build.
const web = {
  entryPoints: ['src/webview/main.tsx'],
  outfile: 'dist/webview.js',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  minify: !watch,
  define: { 'process.env.NODE_ENV': watch ? '"development"' : '"production"' }
};

// Tailwind compiles to a static media/main.css that the CSP-locked webview loads via <link>.
// Runs as its own process since esbuild doesn't drive Tailwind.
const tailwindArgs = [
  '@tailwindcss/cli',
  '-i', 'src/webview/styles.css',
  '-o', 'media/main.css',
  ...(watch ? ['--watch'] : ['--minify'])
];

const runTailwind = () =>
  new Promise((resolve, reject) => {
    const child = spawn('npx', tailwindArgs, { stdio: 'inherit' });
    // In watch mode the process stays alive; resolve once it's spawned.
    if (watch) return resolve(child);
    child.on('exit', (code) => (code === 0 ? resolve(child) : reject(new Error(`tailwind exited ${code}`))));
  });

if (watch) {
  const ctxs = await Promise.all([esbuild.context(host), esbuild.context(web)]);
  await Promise.all(ctxs.map((ctx) => ctx.watch()));
  await runTailwind();
  console.log('claude-viewer: watching host + webview + css…');
} else {
  await Promise.all([esbuild.build(host), esbuild.build(web), runTailwind()]);
}
