import { TrackedItem, toTrackedItem } from './tracked-items';

// Vite's build-time glob, typed here rather than by pulling in `vite/client` globally — this is
// the only file in the repo that uses it, and the extension's esbuild bundles never reach it.
interface ViteImportMeta {
  glob: (
    pattern: string,
    options: { query: string; import: string; eager: true }
  ) => Record<string, string>;
}

// `tracking/` is gitignored, so this is empty in a fresh clone and that's a normal outcome, not
// an error. Eager and static on purpose: Vite then watches every matched file, and editing a note
// invalidates this module and re-renders whatever component imported it. That's the live update —
// there's no watcher here and no host round trip, because Storybook's dev server already has one.
const FILES: Record<string, string> = (import.meta as unknown as ViteImportMeta).glob(
  '../../../tracking/ideas/*.md',
  { query: '?raw', import: 'default', eager: true }
);

export const loadTrackedItems = (): TrackedItem[] =>
  Object.entries(FILES).map(([path, raw]) => toTrackedItem({ path, raw }));
