import { homedir } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';

// Where the instructions an agent reads live, and what keeps them current. The extension ships the
// file and copies it here; a CLAUDE.md holds one `@` line pointing at this path, so the format can
// change on an update without anyone re-pasting anything.
//
// `~/.claude-viewer/` rather than the extension's own globalStorage, which was the first answer and
// is wrong twice: that path holds a space (`Application Support`), and `system-prompt/imports.ts`
// matches an `@` import as non-whitespace — so it would resolve to `~/Library/Application`. It's
// also per-editor-flavour, and an agent in a terminal can't know which of Code, Insiders or Cursor
// wrote it. This is one path on every OS and every editor, and still not under `~/.claude`, so the
// read-only promise holds.
export const DELIVERABLE_DOC_PATH: string = join(homedir(), '.claude-viewer', 'deliverables.md');

// The line to put in a CLAUDE.md. `~` rather than the expanded home directory: that's the form the
// import resolver takes and the form that survives being copied between machines.
export const DELIVERABLE_IMPORT_LINE: string = '@~/.claude-viewer/deliverables.md';

// Writes the shipped instructions out, if they aren't already there byte for byte. Called on
// activate, so the file tracks the installed version — and skipped when nothing changed, since an
// unconditional write would touch the mtime on every window that opens.
//
// Reading it needs nothing running: it's a plain file, and an agent in a terminal with the editor
// closed reads it fine. Writing needs this extension to have activated *once, ever* — which is the
// whole reason `setup-deliverables` exists, since nothing else advertises the feature.
export const writeDeliverableDoc = async (extensionUri: vscode.Uri): Promise<void> => {
  const source: vscode.Uri = vscode.Uri.joinPath(extensionUri, 'resources', 'deliverables.md');
  const target: vscode.Uri = vscode.Uri.file(DELIVERABLE_DOC_PATH);

  try {
    const shipped: Uint8Array = await vscode.workspace.fs.readFile(source);
    if (await _matches({ target, shipped })) return;

    await vscode.workspace.fs.writeFile(target, shipped);
  } catch {
    // A home directory that can't be written to is not worth a notification on every launch. The
    // setup command says so out loud, because there someone asked.
  }
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
