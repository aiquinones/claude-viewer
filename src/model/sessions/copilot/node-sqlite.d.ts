// `node:sqlite` as much of it as `usage-db.ts` uses. Declared here because `@types/node` is on v20
// and the module landed in Node 22.5 — the extension host runs a Node that has it (VS Code 1.133 is
// Electron 42 / Node 24), but the types this repo compiles against don't know that yet.
//
// Deliberately narrower than the real API: widening it means having read the docs for whatever was
// added, and `usage-db.ts` opens one database read-only and runs one prepared statement.
declare module 'node:sqlite' {
  export interface StatementSync {
    all(...parameters: unknown[]): unknown[];
  }

  export interface DatabaseSyncOptions {
    readOnly?: boolean;
  }

  export class DatabaseSync {
    constructor(path: string, options?: DatabaseSyncOptions);
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
