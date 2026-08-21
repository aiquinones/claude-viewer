// How long Claude Code keeps a transcript, as a value. Pure, and separate from `load.ts` because
// the webview needs this shape and must never reach the module that reads it — `load.ts` imports
// `config/read`, which imports `node:fs`, and one type import is enough to drag the whole chain
// into the panel bundle.

// Which layer set it. Ordered highest precedence first, which is also the order `load.ts` reads in.
//
// Deliberately not annotated: a type here would erase the literals RetentionSource derives from.
export const RETENTION_SOURCES = ['managed', 'local', 'project', 'user', 'default'] as const;

export type RetentionSource = (typeof RETENTION_SOURCES)[number];

export interface Retention {
  days: number;
  source: RetentionSource;
  // The file it came from. Absent on the default, which comes from no file.
  path?: string;
}

// What Claude Code uses when nothing sets it. Documented, not measured — hence `source: 'default'`
// rather than a claim that this machine was checked and found to be on 30.
export const DEFAULT_CLEANUP_PERIOD_DAYS: number = 30;

export const DEFAULT_RETENTION: Retention = {
  days: DEFAULT_CLEANUP_PERIOD_DAYS,
  source: 'default'
};
