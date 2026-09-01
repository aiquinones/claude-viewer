import { homedir } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';

// The docs this extension writes for an agent to read. Each one ships in `resources/` and is copied
// to `~/.claude-viewer/` on activate, so a CLAUDE.md can hold one `@` line and the format can change
// on an update without anyone re-pasting anything.
//
// `~/.claude-viewer/` rather than the extension's own globalStorage, which was the first answer and
// is wrong twice: that path holds a space (`Application Support`), and `system-prompt/imports.ts`
// matches an `@` import as non-whitespace — so it would resolve to `~/Library/Application`. It's
// also per-editor-flavour, and an agent in a terminal can't know which of Code, Insiders or Cursor
// wrote it. This is one path on every OS and every editor, and still not under `~/.claude`, so the
// read-only promise holds.
const DOCS_DIR: string = '.claude-viewer';

export interface ViewerDoc {
  id: string;
  // What the picker calls it.
  label: string;
  // The line under it there. Says what the doc teaches, not that it's a doc.
  summary: string;
  // The filename, the same in `resources/` and in `~/.claude-viewer/`. One name rather than two
  // that have to agree.
  file: string;
}

// Deliberately annotated rather than `as const`: nothing derives a union from these ids, and with
// one entry every literal field would narrow to it — so the first comparison against a second doc's
// id would be a no-overlap error. Same trap `SurfaceStatus` widens back out of.
export const VIEWER_DOCS: readonly ViewerDoc[] = [
  {
    id: 'deliverables',
    label: 'Deliverables',
    summary: 'How an agent announces what it produced — a Storybook, a plan, a link',
    file: 'deliverables.md'
  }
];

// Where the doc is written, and the line that pulls it into a CLAUDE.md. Both derived from the
// filename, so adding a doc is one entry above and nothing else.
export const docPath = (doc: ViewerDoc): string => join(homedir(), DOCS_DIR, doc.file);

// `~` rather than the expanded home directory: that's the form the import resolver takes, and the
// form that survives being copied between machines.
export const docImportLine = (doc: ViewerDoc): string => `@~/${DOCS_DIR}/${doc.file}`;

interface WriteViewerDocArgs {
  extensionUri: vscode.Uri;
  doc: ViewerDoc;
}

// Writes one doc out if it isn't already there byte for byte, and says whether it's on disk after.
// Skipped when nothing changed, since an unconditional write would touch the mtime on every window
// that opens.
export const writeViewerDoc = async ({ extensionUri, doc }: WriteViewerDocArgs): Promise<boolean> => {
  const source: vscode.Uri = vscode.Uri.joinPath(extensionUri, 'resources', doc.file);
  const target: vscode.Uri = vscode.Uri.file(docPath(doc));

  try {
    const shipped: Uint8Array = await vscode.workspace.fs.readFile(source);
    if (await _matches({ target, shipped })) return true;

    await vscode.workspace.fs.writeFile(target, shipped);
    return true;
  } catch {
    // A home directory that can't be written to isn't worth a notification on every launch. The
    // View Docs command reports it, because there someone asked.
    return false;
  }
};

// All of them, on activate. Reading one needs nothing running — it's a plain file, and an agent in
// a terminal with the editor closed reads it fine. Writing needs this extension to have activated
// once, ever.
export const writeViewerDocs = async (extensionUri: vscode.Uri): Promise<void> => {
  await Promise.all(VIEWER_DOCS.map((doc) => writeViewerDoc({ extensionUri, doc })));
};

interface MatchesArgs {
  target: vscode.Uri;
  shipped: Uint8Array;
}

const _matches = async ({ target, shipped }: MatchesArgs): Promise<boolean> => {
  try {
    const held: Uint8Array = await vscode.workspace.fs.readFile(target);
    return Buffer.from(held).equals(Buffer.from(shipped));
  } catch {
    return false;
  }
};
