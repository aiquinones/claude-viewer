import * as vscode from 'vscode';
import { ViewerDoc, VIEWER_DOCS, docImportLine, docPath, writeViewerDoc } from '../../host/viewer-docs';
import { pickDoc } from './quick-pick';

// Registered in package.json under contributes.commands — the two have to agree.
export const VIEW_DOCS_COMMAND: string = 'claudeViewer.viewDocs';

// How long the status bar holds the confirmation. Long enough to read, short enough that it's gone
// before you paste.
const COPIED_MS: number = 4000;

interface ViewDocsArgs {
  context: vscode.ExtensionContext;
}

// The docs this extension writes for an agent to read, as a list you pick from. One entry today —
// deliverables — and adding a second is an entry in `VIEWER_DOCS` and nothing here.
//
// It exists because nothing else says these docs are there. The panel has no page about them and
// the import line isn't something you'd guess, so this is the whole of the feature's discovery
// until the power-user section is built.
export const viewDocs = async ({ context }: ViewDocsArgs): Promise<void> => {
  const doc: ViewerDoc | undefined = await pickDoc(VIEWER_DOCS);
  if (!doc) return;

  // Rewritten on the way to opening it, so what you read is what this version ships rather than
  // whatever an older one left behind. Activate does this too — the point here is that a doc you
  // asked to see is current, not that it exists.
  const written: boolean = await writeViewerDoc({ extensionUri: context.extensionUri, doc });
  if (!written) {
    await vscode.window.showErrorMessage(`Claude Viewer: couldn't write ${docPath(doc)}.`);
    return;
  }

  const opened: vscode.TextDocument = await vscode.workspace.openTextDocument(
    vscode.Uri.file(docPath(doc))
  );
  await vscode.window.showTextDocument(opened, { preview: true });

  // The line you actually need, on the clipboard rather than in a notification you'd have to
  // retype. The status bar rather than a modal, the rule `copySessionId` follows: this is feedback
  // for something you asked for, and it names what it copied so it isn't a silent side effect.
  await vscode.env.clipboard.writeText(docImportLine(doc));
  vscode.window.setStatusBarMessage(`Copied ${docImportLine(doc)} — paste it into a CLAUDE.md`, COPIED_MS);
};
